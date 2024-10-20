import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user';
import filterStore, { IFilterStore } from '../../store/filters';
import Shuffle from 'shufflejs';
import styles from './styles';
import '../bob-card/bob-card';
import { abbreviateState } from '../../shared/utilities';

const API_URL = import.meta.env.VITE_API_URL;
const FOUR_SQUARE_KEY = import.meta.env.VITE_FOUR_SQUARE_KEY;

@customElement('bob-cards')
export default class BobCards extends LitElement {
  static styles = [styles];

  @property({ type: Boolean })
  mine: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  businesses: any;

  @state()
  businessData: any[] = [];

  @state()
  businessDataFiltered: any;

  @state()
  maxNumberOfBusinesses: number = 0;

  @state()
  currentNumberOfBusinesses: number = 0;

  @state()
  shuffleInstance: any;

  @state()
  currentPage: number = 1;

  @state()
  totalPages: number = 1;

  @query('ul')
  shuffleGrid!: HTMLElement;

  @state()
  filterState: IFilterStore = filterStore.getInitialState();

  constructor() {
    super();

    document.addEventListener('photo-fetch-attempted', () => {
      this.currentNumberOfBusinesses = this.currentNumberOfBusinesses + 1;
    });

    filterStore.subscribe((state) => {
      this.filterState = state;
      this.filterUniqueBusinesses();
    });
  }

  firstUpdated() {
    this.getBusinesses();
    window.addEventListener('scroll', () => this.handleScroll());
    this.shuffleInstance = new Shuffle(this.shuffleGrid, {
      itemSelector: 'li',
    });
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('businessData')) {
      this.filterUniqueBusinesses();
    }

    // update shuffle display with new filtered data
    if (changedProperties.has('businessDataFiltered')) {
      setTimeout(() => {
        this.shuffleInstance.resetItems();
      }, 500);
    }
  }

  render() {
    return html`
      ${this.businessDataFiltered?.length > 0 ? '' : html`<div><bob-loader loading></bob-loader></div>`}
      <ul>${this.makeBobCards()}</ul>
    `;
  }

  async getBusinesses() {
    const author = this.mine ? `&author=${this.userState.user.user_id}` : '';
    const queryParams = `per_page=10&page=${this.currentPage}${author}`;

    this.businesses = await fetch(`${API_URL}/wp-json/wp/v2/business?${queryParams}`)
      .then((response) => {
        this.totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
        return response.json()
      })
      .catch((error) => console.log(error));

    this.maxNumberOfBusinesses = this.businesses.length;

    this.businesses.map(async (business: any) => {
      const businessData = {
        post: business,
        details: await this.getBusinessDetails(business.meta.bob_fsq_id)
      };
      this.businessData = [
        ...this.businessData,
        businessData,
      ];
    });
  }

  async getBusinessDetails(fsq_id: string) {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': FOUR_SQUARE_KEY
      }
    };

    const fields = [
      'fsq_id',
      'name',
      'geocodes',
      'location',
      'tel',
      'website',
      'social_media',
      'rating',
      'price',
      'link',
    ];

    return await fetch(`https://api.foursquare.com/v3/places/${fsq_id}?fields=${fields.join(',')}`, options)
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }

  makeBobCards() {
    if (this.businessDataFiltered?.length > 0) {
      return html`
        ${this.businessDataFiltered.map((business: any) => html`
          <li>
            <bob-card
              .details=${business.details}
              .post=${business.post}
              .mine=${this.mine}
              .shuffle=${this.shuffleInstance}>
            </bob-card>
          </li>
        `)}
      `;
    }

    return this.mine
      ? html`<li><p>You haven't added any businesses yet.</p></li>`
      : html`<li><p>There are no businesses available.</p></li>`
  }

  filterUniqueBusinesses() {
    const uniqueIDs = new Set(this.businessData.map((business: any) => business.details.fsq_id));
    this.businessDataFiltered = this.businessData.filter((business: any) => {
      if (!this.filterState.zipCodes.includes(business.details.location.postcode) && this.filterState.nearby) {
        return false;
      }

      if (business.details.location.region !== abbreviateState(this.filterState.region) && this.filterState.onlyInState) {
        return false;
      }

      if (uniqueIDs.has(business.details.fsq_id)) {
        uniqueIDs.delete(business.details.fsq_id);
        return true;
      }

      return false;
    });
  }

  handleScroll() {
    const shuffleBlockOffset = this.shuffleGrid.offsetTop + this.shuffleGrid.clientHeight - 2; // add -2 to trigger slightly before .shuffle ends
    const pageOffset = window.scrollY + window.innerHeight;

    if (pageOffset > shuffleBlockOffset) {
      this.loadMoreCards();
    }
  }

  loadMoreCards() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.getBusinesses();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-cards': BobCards
  }
}

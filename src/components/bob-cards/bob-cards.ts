import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user';
import Shuffle from 'shufflejs';
import styles from './styles';
import '../bob-card/bob-card';

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
  totalPages: number = 0;

  @query('ul')
  shuffleGrid!: HTMLElement;

    constructor() {
      super();
      document.addEventListener('photo-fetch-attempted', () => {
        this.currentNumberOfBusinesses = this.currentNumberOfBusinesses + 1;
      });
    }

  firstUpdated() {
    this.getBusinesses();
     window.addEventListener('scroll', () => this.handleScroll());
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('businessData')) {
      this.filterUniqueBusinesses();
    }

    if (changedProperties.has('currentNumberOfBusinesses')) {
      this.determineMaxNumberOfBusinessesReached();
    }
  }

  render() {
    return this.businessDataFiltered?.length > 0 ? this.makeBobCards() : html`<div><bob-loader loading></bob-loader></div>`;
  }

  async getBusinesses() {
    const queryParams = `per_page=10&page=${this.currentPage}&author=${this.userState.user.user_id}`;

    this.businesses = await fetch(`${API_URL}/wp-json/wp/v2/business?${queryParams}`)
      .then((response) => {
        this.totalPages = parseInt(response.headers.get('x-wp-totalpages') || '0');
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
    ];

    return await fetch(`https://api.foursquare.com/v3/places/${fsq_id}?fields=${fields.join(',')}`, options)
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }

  makeBobCards() {
    if (this.businessDataFiltered?.length > 0) {
      return html`
        <ul>
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
        </ul>
      `
    }

    return html`<p>You haven't added any businesses yet.</p>`;
  }

  filterUniqueBusinesses() {
    const uniqueIDs = new Set(this.businessData.map((business: any) => business.details.fsq_id));
      this.businessDataFiltered = this.businessData.filter((business: any) => {
        if (uniqueIDs.has(business.details.fsq_id)) {
          uniqueIDs.delete(business.details.fsq_id);
          return true;
        }
        return false
      });
  }

  determineMaxNumberOfBusinessesReached() {
    if (this.currentNumberOfBusinesses >= this.maxNumberOfBusinesses) {
      // this.loader.loading = false;
      setTimeout(() => {
        if (this.shuffleGrid) {
          this.shuffleInstance = new Shuffle(this.shuffleGrid, {
            itemSelector: 'li',
          });
        }
      }, 1);
    }
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

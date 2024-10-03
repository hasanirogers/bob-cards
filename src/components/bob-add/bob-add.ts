import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user';
import Shuffle from 'shufflejs';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';

import '../bob-card-add/bob-card-add';
import '../bob-loader/bob-loader';
import BobLoader from '../bob-loader/bob-loader';

// const API_URL = import.meta.env.VITE_API_URL;
const FOUR_SQUARE_KEY = import.meta.env.VITE_FOUR_SQUARE_KEY;

@customElement('bob-add')
export default class BobAdd extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  businesses: any = {};

  @state()
  maxNumberOfBusinesses: number = 0;

  @state()
  currentNumberOfBusinesses: number = 0;

  @query('[name="search"]')
  searchInput!: KemetInput;

  @query('[name="zipcode"]')
  zipCodeInput!: KemetInput;

  @query('bob-loader')
  loader!: BobLoader;

  @query('section ul')
  shuffleGrid!: HTMLElement;

  constructor() {
    super();

    document.addEventListener('photo-fetch-attempted', () => {
      this.currentNumberOfBusinesses = this.currentNumberOfBusinesses + 1;
    })
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('currentNumberOfBusinesses')) {
      this.determineMaxNumberOfBusinessesReached();
    }
  }

  render() {
    return html`
      <form>
        <legend>Search for a business</legend>
        <fieldset>
          <kemet-field slug="search" label="Search">
            <kemet-input
              slot="input"
              name="search"
              type="search"
              icon-left="search"
              @kemet-input-input=${() => this.handleSearch()}
            >
            </kemet-input>
          </kemet-field>
          <kemet-field slug="search" label="Near ZipCode" message="Enter a valid ZipCode">
            <kemet-input
              slot="input"
              name="zipcode"
              type="text"
              validate-on-blur
              inputmode="numeric"
            >
            </kemet-input>
          </kemet-field>
        </fieldset>
      </form>
      <section>
        <div><bob-loader></bob-loader></div>
        <ul>
          ${this.makeBusinesses()}
        </ul>
      </section>
    `;
  }

  async handleSearch() {
    const validZipCode = /^(\d{5})?$/;
    if (validZipCode.test(this.zipCodeInput.value)) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: FOUR_SQUARE_KEY
        }
      }

      const near = this.zipCodeInput.value ? `&near=${this.zipCodeInput.value}` : '';

      if (this.searchInput.value) {
        this.loader.loading = true;

        this.businesses  = await fetch(`https://api.foursquare.com/v3/places/search?query=${this.searchInput.value}&limit=50${near}`, options)
          .then(response => response.json())
          .catch(error => console.error('Error:', error));

        this.maxNumberOfBusinesses = this.businesses.results?.length;
      }
    } else {
      this.zipCodeInput.status = 'error';
    }
  }

  makeBusinesses() {
    return this.businesses.results?.map((business: any) => {
      return html`
        <li>
          <bob-card-add
            fsq-id="${business?.fsq_id}"
            name="${business?.name}"
            address="${business?.location.formatted_address}">
          </bob-card-add>
        </li>
      `;
    });

  }

  determineMaxNumberOfBusinessesReached() {
    if (this.currentNumberOfBusinesses >= this.maxNumberOfBusinesses) {
      this.loader.loading = false;
      setTimeout(() => {
        new Shuffle(this.shuffleGrid, {
          itemSelector: 'section li',
        })
      }, 1);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-add': BobAdd
  }
}

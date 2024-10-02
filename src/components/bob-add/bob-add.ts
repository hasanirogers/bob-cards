import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';

import '../bob-card-add/bob-card-add';

// const API_URL = import.meta.env.VITE_API_URL;
const FOUR_SQUARE_KEY = import.meta.env.VITE_FOUR_SQUARE_KEY;

@customElement('bob-add')
export default class BobAdd extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  businesses: any = {};

  @query('[name="search"]')
  searchInput!: KemetInput;

  @query('[name="zipcode"]')
  zipCodeInput!: KemetInput;

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
        this.businesses  = await fetch(`https://api.foursquare.com/v3/places/search?query=${this.searchInput.value}&limit=50${near}`, options)
          .then(response => response.json())
          .catch(error => console.error('Error:', error));
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
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-add': BobAdd
  }
}

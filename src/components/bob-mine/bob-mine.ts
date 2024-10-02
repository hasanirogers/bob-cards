import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './styles';
import userStore, { IUserStore } from '../../store/user';

const API_URL = import.meta.env.VITE_API_URL;
const FOUR_SQUARE_KEY = import.meta.env.VITE_FOUR_SQUARE_KEY;

@customElement('bob-mine')
export default class BobMine extends LitElement {
  static styles = [styles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  businesses: any;

  @state()
  businessDetails: any[] = [];

  @state()
  businessDetailsFiltered: any;

  firstUpdated() {
    this.getBusinesses();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('businessDetails')) {
      this.filterUniqueBusinesses();
    }
  }

  render() {
    return this.makeBobCards();
  }

  async getBusinesses() {
    this.businesses = await fetch(`${API_URL}/wp-json/wp/v2/business?author=${this.userState.user.user_id}`)
      .then((response) => response.json())
      .catch((error) => console.log(error));

    this.businesses.map(async (business: any) => {
      const businessDetails = await this.getBusinessDetails(business.meta.bob_fsq_id);
      this.businessDetails = [
        ...this.businessDetails,
        businessDetails,
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

    return await fetch(`https://api.foursquare.com/v3/places/${fsq_id}`, options)
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }

  makeBobCards() {
    if (this.businessDetailsFiltered?.length > 0) {
      return html`
        <ul>
          ${this.businessDetailsFiltered.map((business: any) => html`
            <bob-card .details="${business}">${business.name}</bob-card>
          `)}
        </ul>
      `
    }

    return html`<p>You haven't added any businesses yet.</p>`;
  }

  filterUniqueBusinesses() {
    const uniqueIDs = new Set(this.businessDetails.map((business: any) => business.fsq_id));
      this.businessDetailsFiltered = this.businessDetails.filter((business: any) => {
        if (uniqueIDs.has(business.fsq_id)) {
          uniqueIDs.delete(business.fsq_id);
          return true;
        }
        return false
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-mine': BobMine
  }
}

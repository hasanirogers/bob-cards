import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Task } from '@lit/task';
import userStore, { IUserStore } from '../../store/user';
import alertStore, { IAlertStore } from '../../store/alert';
import sharedStyles from '../../shared/styles';
import styles from './styles';

const API_URL = import.meta.env.VITE_API_URL;
const FOUR_SQUARE_KEY = import.meta.env.VITE_FOUR_SQUARE_KEY;

// export interface IFourSquarePhoto {
//   id: string;
//   created_at: string;
//   prefix: string;
//   suffix: string;
//   width: number;
//   height: number;
// }

@customElement('bob-card-add')
export default class BobCardAdd extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: String, attribute: 'fsq-id' })
  fsqId!: string;

  @property({ type: String })
  name!: string;

  @property({ type: String })
  address!: string;

  // @property({ type: Object })
  // photo: IFourSquarePhoto | null = null;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  private getBusinessPhotos = new Task(this, {
    task: async ([fsqId]) => {
      const url = `https://api.foursquare.com/v3/places/${fsqId}/photos`;

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: FOUR_SQUARE_KEY
        }
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    },
    args: () => [this.fsqId]
  })


  render() {
    return html`
      ${this.getBusinessPhotos.render({
        pending: () => html`...loading`,
        complete: (photos) => {
          if (photos[0]?.prefix && photos[0]?.suffix) {
             return html`<img src="${photos[0]?.prefix}512x512${photos[0]?.suffix}" title=${this.name} />`;
          }
          return null;
        },
        error: () => console.log('There was an error fetching the photos'),
      })}
      <section>
        <kemet-button outlined @click=${() => this.addBusiness()}>
          <kemet-icon icon="plus-circle" size="32"></kemet-icon>
        </kemet-button>
        <div>
          <h3>${this.name}</h3>
          <p>${this.address}</p>
        </div>
      </section>
    `
  }

  async addBusiness() {
    const isExisting = await this.checkIfBusinessExists();

    if (!isExisting) {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userState.user.token}`
        },
        body: JSON.stringify({
          title: this.name,
          author: parseInt(this.userState.user.user_id),
          status: 'publish',
          meta: {
            bob_fsq_id: this.fsqId,
          },
        })
      }

      const endpoint = 'wp-json/wp/v2/business';

      await fetch(`${API_URL}/${endpoint}`, options)
        .then(response => response.json())
        .then(() => {
          this.alertState.setStatus('success');
          this.alertState.setMessage('Business added successfully!');
          this.alertState.setOpened(true);
          this.alertState.setIcon('check-circle');
        })
        .catch(error => console.log(error));

      return;
    }

    this.alertState.setStatus('error');
    this.alertState.setMessage('You have already added this business');
    this.alertState.setOpened(true);
    this.alertState.setIcon('exclamation-circle');
  }

  async checkIfBusinessExists() {
    const endpoint = 'wp-json/bob/v1/get-business-by-fsq-id';

    const business = await fetch(`${API_URL}/${endpoint}?meta_key=bob_fsq_id&meta_value=${this.fsqId}`)
      .then(response => response.json())
      .catch(error => console.log(error));

    console.log(business);

    if (business?.status === 'error') {
      return true
    }

    return false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-card-add': BobCardAdd
  }
}

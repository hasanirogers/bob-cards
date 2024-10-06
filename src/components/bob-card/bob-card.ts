import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Task } from '@lit/task';
import userStore, { IUserStore } from '../../store/user';
import alertStore, { IAlertStore } from '../../store/alert';
import sharedStyles from '../../shared/styles';
import styles from './styles';
import { emitEvent } from '../../shared/utilities';

import '../bob-loader/bob-loader';
import KemetModal from 'kemet-ui/dist/components/kemet-modal/kemet-modal';
import BobCards from '../bob-cards/bob-cards';

const API_URL = import.meta.env.VITE_API_URL;
const FOUR_SQUARE_KEY = import.meta.env.VITE_FOUR_SQUARE_KEY;

@customElement('bob-card')
export default class BobCard extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  details: any;

  @property({ type: Object})
  post: any;

  @property({ type: Boolean })
  mine: boolean = false;

  @property({ type: Object})
  shuffle: any;

  @property({ type: Boolean, reflect: true })
  hidden: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('kemet-modal')
  modal!: KemetModal;

  private getBusinessPhotos = new Task(this, {
    task: async ([details]) => {
      const url = `https://api.foursquare.com/v3/places/${details.fsq_id}/photos`;

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
    args: () => [this.details]
  })


  render() {
    return html`
      ${this.mine ? html`
        <div>
          <kemet-button variant="circle" @click=${() => { this.modal.opened = true; }}>
            <kemet-icon icon="dash-circle" size="32"></kemet-icon>
          </kemet-button>
        </div>
      ` : null }
      <h3>${this.details.name}</h3>
      ${this.getBusinessPhotos.render({
        pending: () => html`<bob-loader loading></bob-loader>`,
        complete: (photos) => {
          emitEvent(document.documentElement, 'photo-fetch-attempted');

          if (photos[0]?.prefix && photos[0]?.suffix) {
             return html`<img src="${photos[0]?.prefix}512x512${photos[0]?.suffix}" title=${this.details.name} />`;
          }

          return null;
        },
        error: () => emitEvent(document.documentElement, 'photo-fetch-attempted'),
      })}
      <section>
          <p>${this.details.tel}</p>
          <p>${this.details.location.formatted_address}</p>
      </section>
      <kemet-modal effect="fall" rounded>
        <kemet-modal-close role="button" aria-label="Close Button">
          <kemet-icon icon="x-circle-fill" size="24"></kemet-icon>
        </kemet-modal-close>
        <h2>Are you sure?</h2>
        <p>Do you really want to remove <strong>${this.details.name}</strong>?</p>
        <div>
          <kemet-button variant="text" @click=${() => this.modal.opened = false}>
            <kemet-icon icon="chevron-left" size="24"></kemet-icon>
            &nbsp;Back
          </kemet-button>
          <kemet-button variant="rounded" @click=${() => this.removeBusiness()}>
            <kemet-icon icon="dash-circle" size="24"></kemet-icon>
            &nbsp;Yes, Remove
          </kemet-button>
        </div>
      </kemet-modal>
    `
  }
  async removeBusiness() {
    this.modal.opened = false;

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userState.user.token}`
      },
    }

    const endpoint = 'wp-json/wp/v2/business';

    await fetch(`${API_URL}/${endpoint}/${this.post.id}`, options)
      .then(response => response.json())
      .then(() => {
        this.hidden = true;
        this.shuffle.resetItems();
        this.shuffle.update();
      })
      .catch(error => console.log(error));

    return;
  }
  async checkIfBusinessExists() {
    const endpoint = 'wp-json/bob/v1/get-business-by-fsq-id';

    const business = await fetch(`${API_URL}/${endpoint}?meta_key=bob_fsq_id&meta_value=${this.details.fsqId}`)
      .then(response => response.json())
      .catch(error => console.log(error));

    if (business?.status === 'error') {
      return true
    }

    return false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-card': BobCard
  }
}

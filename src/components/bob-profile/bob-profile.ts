import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './styles.ts';
import userStore, { IUserStore } from '../../store/user.ts';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('bob-profile')
export default class BobProfile extends LitElement {
  static styles = [styles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  firstUpdated() {
      this.fetchProfileData();
  }

  render() {
    return html`
      profile
    `;
  }

  async fetchProfileData() {
    const userProfile = await fetch(`${API_URL}/wp-json/wp/v2/users/${this.userState.user.user_id.toString()}`)
      .then((response) => response.json());

    console.log(userProfile);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-profile': BobProfile
  }
}

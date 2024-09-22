import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { switchRoute } from '../../shared/utilities.ts';
import userStore, { IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';

@customElement('bob-header-nav')
export default class BobHeaderNav extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  constructor() {
    super();
    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  render() {
    return this.makeNav();
  }

  makeNav() {
    if (this.userState.isLoggedIn) {
      return html`
        <section>
          <div>
            Welcome ${this.userState.profile.first_name},
            <br />
            <button variant="text" @click=${() => { this.userState.logout(); switchRoute('home'); }}>Log&nbsp;Out</button>
          </div>
          <button @click=${() => switchRoute('profile', 'BobCards | Profile')}>
            ${
              this.userState.profile.meta.bob_profile_image
                ? html`<div class="profile-picture" style="background-image: url('${this.userState.profile.meta.bob_profile_image}}')"></div>`
                : html`<kemet-avatar><kemet-icon size="48" icon="person"></kemet-icon></kemet-avatar>`
            }
          </button>
        </section>
      `;
    } else {
      return html`
        <kemet-button @click=${() => switchRoute('login', 'BobCards | Login')} variant="text">Login</kemet-button>
      `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-header-nav': BobHeaderNav
  }
}

import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { switchRoute } from '../../shared/utilities.ts';
import userStore, { IUserStore } from '../../store/user';
import styles from './styles';

@customElement('bob-header-nav')
export default class BobHeaderNav extends LitElement {
  static styles = [styles];

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
        <nav>
          <kemet-button variant="text">My&nbsp;Business</kemet-button>
          <kemet-button variant="text">Add&nbsp;Business</kemet-button>
          <kemet-button variant="text" @click=${() => switchRoute('profile', 'BobCards | Profile')}>Profile</kemet-button>
          <kemet-button variant="text" @click=${() => this.userState.logout()}>Log&nbsp;Out</kemet-button>
        </nav>
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

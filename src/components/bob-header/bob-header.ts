import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { switchRoute } from '../../shared/utilities';
import SVGHandshake from '../../assets/handshake.svg';
import userStore, { IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../bob-header-nav/bob-header-nav';

@customElement('bob-header')
export default class BobHeader extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  render() {
    return html`
      <header>
        <div>
          <button @click=${() => switchRoute('/home')} class="logo">
            <span><img src=${SVGHandshake} alt="BobCards logo" /></span>
            <h1>BobCards</h1>
          </button>
          ${this.makeNav()}
        </div>
        <bob-header-nav></bob-header-nav>
      </header>
    `
  }

  makeNav() {
    if (this.userState.isLoggedIn) {
      return html`
        <nav>
          <button @click=${() => switchRoute('mine')}>My Businesses</button>
          <button @click=${() => switchRoute('members')}>Members</button>
        </nav>
      `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-header': BobHeader
  }
}

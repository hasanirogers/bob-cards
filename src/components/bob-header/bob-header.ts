import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { switchRoute } from '../../shared/utilities';
import SVGHandshake from '../../assets/handshake.svg';
import userStore, { IUserStore } from '../../store/user';
import appStore, { IAppStore } from '../../store/app';
import nav from '../bob-app/nav';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../bob-header-nav/bob-header-nav';


@customElement('bob-header')
export default class BobHeader extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getInitialState();

   constructor() {
    super();
    appStore.subscribe((state) => {
      this.appState = state;
    });
  }

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
        ${this.makeProfilePanel()}
      </header>
    `
  }

  makeNav() {
    if (this.userState.isLoggedIn) {
      return html`
        <nav>${nav}</nav>
      `;
    }
  }

  makeProfilePanel() {
    if (this.appState.isMobile) {
      return html`
        <button @click=${() => this.appState.setIsDrawerOpened(true)}>
          <kemet-icon icon="list" size="32"></kemet-icon>
        </button>
      `;
    }

    return html`<bob-header-nav></bob-header-nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-header': BobHeader
  }
}

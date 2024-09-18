import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { switchRoute } from '../../shared/utilities';
import styles from './styles';
import SVGHandshake from '../../assets/handshake.svg';

import '../bob-header-nav/bob-header-nav';

@customElement('bob-header')
export default class BobHeader extends LitElement {
  static styles = [styles];

  render() {
    return html`
      <header>
        <button @click=${() => switchRoute('/home')} class="logo">
          <span><img src=${SVGHandshake} alt="BobCards logo" /></span>
          <h1>BobCards <small>Bob's are blacked owned business.</small></h1>
        </button>
        <div>
          <bob-header-nav></bob-header-nav>
        </div>
      </header>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-header': BobHeader
  }
}

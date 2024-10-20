import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import styles from './styles';
import sharedStyles from '../../shared/styles'

import '../bob-cards/bob-cards';

@customElement('bob-mine')
export default class BobMine extends LitElement {
  static styles = [styles, sharedStyles];

  render() {
    return html`
      <h2>My Bob Cards</h2>
      <bob-cards .mine=${true}></bob-cards>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-mine': BobMine
  }
}

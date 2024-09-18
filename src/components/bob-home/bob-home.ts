import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';

@customElement('bob-home')
export default class BobHome extends LitElement {
  static styles = [styles];

  render() {
    return html`
      Home
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-home': BobHome
  }
}

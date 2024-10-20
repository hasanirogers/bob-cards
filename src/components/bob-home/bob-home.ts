import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import geoStore from '../../store/geo';
import styles from './styles';

import '../bob-cards/bob-cards';
import '../bob-filters/bob-filters';

@customElement('bob-home')
export default class BobHome extends LitElement {
  static styles = [styles];

  @state()
  geoState: any = geoStore.getState();

  render() {
    return html`
      ${this.geoState.address ? html`<bob-filters></bob-filters>` : null}
      <bob-cards></bob-cards>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-home': BobHome
  }
}

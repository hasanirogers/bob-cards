import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import geoStore from '../../store/geo';
import filterStore, { IFilterStore } from '../../store/filters';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import KemetToggle from 'kemet-ui/dist/components/kemet-toggle/kemet-toggle';

@customElement('bob-filters')
export default class BobFilters extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  geoState: any = geoStore.getState();

  @state()
  filterState: IFilterStore = filterStore.getInitialState();

  @query('[label="Nearby"]')
  nearbyToggle!: KemetToggle;

  @query('[label*="Only in"]')
  onlyInToggle!: KemetToggle;

  render() {
    return html`
      <div class="toggles">
        <kemet-toggle label="Nearby" @kemet-toggle-change=${() => this.handleNearByToggle()}></kemet-toggle>
        <kemet-toggle label="Only in ${this.geoState.address.address.state}" @kemet-toggle-change=${() => this.handleOnlyInToggle()}></kemet-toggle>
      </div>
    `;
  }

  handleNearByToggle() {
    this.filterState.setNearby(this.nearbyToggle.checked);
  }

  handleOnlyInToggle() {
    this.filterState.setOnlyInState(this.onlyInToggle.checked);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-filters': BobFilters
  }
}

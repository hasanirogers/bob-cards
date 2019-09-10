/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import { html, css, LitElement } from 'lit-element';

import 'shufflejs/dist/shuffle.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';

import '../../bob-card/bob-card.js';
import '../../bob-catnav/bob-catnav.js';

export class PageMain extends LitElement {
  static get styles() {
    return css`
      .shuffle {
        margin: 0 1rem;
        height: auto;
      }

      .shuffle__item {
        width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .shuffle__sizer {
        width: 8.33333%;
      }

      @media screen and (min-width: 769px) {
        .filters {
          padding: 1rem 2rem;
        }

        .shuffle__item {
          width: 33%;
        }
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      businesses: { type: Object },
      userAddress: { type: Object },
      shuffleInstance: { type: Object },
    };
  }

  constructor() {
    super();
    this.businesses = {};
    this.checkedState = true;
  }

  render() {
    let userPostcodeFilter;
    let userStateFilter;
    let businesses;

    if (this.userAddress) {
      userPostcodeFilter = html `
        <p>
          <label>
            <paper-toggle-button @change="${(event) => {this.filterPostCode(this.userAddress.address.postcode, event); }}"></paper-toggle-button>
            Only show businesses in ${this.userAddress.address.postcode}.
          </label>
        </p>
      `;
    }

    if (this.userAddress) {
      userStateFilter = html `
        <p>
          <label>
          <paper-toggle-button checked @change="${(event) => {this.filterState(this.userAddress.address.state, event); }}"></paper-toggle-button>
          Only show businesses in ${this.userAddress.address.state}.
          </label>
        </p>
      `;
    }

    if (this.businesses.length > 0) {
      businesses = this.businesses.map((business) => {
        const categories = this.getCatArray(business.acf.categories);

        return html `
          <figure
            class="shuffle__item"
            title="${business.title.rendered}"
            data-groups="${categories}"
            data-city="${business.acf.city}"
            data-state="${business.acf.state.name}"
            data-postcode="${business.acf.zip}">
            <bob-card
              name="${business.title.rendered}"
              image="${business.acf.cardImage ? business.acf.cardImage.url : ''}"
              address="${business.acf.address}"
              city="${business.acf.city}"
              state="${business.acf.state.name}"
              zip="${business.acf.zip}"
              phone="${business.acf.phone}"
              website="${business.acf.website}"
              facebook="${business.acf.facebook}">
            </bob-card>
          </figure>
        `;
      });
    }

    return html`
      <section class="filters">
        <div class="filters__location">
          ${userPostcodeFilter}
          ${userStateFilter}
        </div>
        <bob-catnav .shuffleInstance="${this.shuffleInstance}"></bob-catnav>
      </section>

      <section class="shuffle">
        ${businesses}
      </section>
    `;
  }

  firstUpdated() {
    const { Shuffle } = window;
    const element = this.shadowRoot.querySelector('.shuffle');

    this.shuffleInstance = new Shuffle(element, {
      itemSelector: '.shuffle__item',
      sizer: this.shadowRoot.querySelector('.shuffle__sizer'),
    });

    this.getLocation();
    this.fetchBusinesses();
  }

  updated() {
    this.shuffleInstance.resetItems();
    this.shuffleInstance.update();

    if (this.userAddress) this.filterState(this.userAddress.address.state, null, true);
    // if (this.userAddress) this.filterPostCode((this.userAddress.address.postcode, null));
  }

  getCatArray(catObject) {
    const catArray = [];

    if (catObject) {
      // map through cat object and push slug to array
      catObject.map((cat) => catArray.push(cat.slug));
    }

    return JSON.stringify(catArray);
  }

  filterPostCode(postcode, event) {
    if (event) {
      this.shuffleInstance.filter((element) => {
        if (event.path[0].checked) {
          return element.getAttribute('data-postcode') === postcode;
        }
      });
    }

    return true;
  }

  filterState(state, event, initChecked) {
    console.log('ran filter state');

    this.shuffleInstance.filter((element) => {
      const userChecked = event ? event.path[0].checked : false;

      if (userChecked || initChecked) {
        return element.getAttribute('data-state') === state;
      }

      return true;
    })
  }

  filterTitle(event) {
    console.log('filterTitle called');
    const searchText = event.target.value.toLowerCase();

    this.shuffleInstance.filter((element) => {
      const titleElement = element.querySelector('bob-card');
      const titleText = titleElement.getAttribute('name').toLowerCase();

      return titleText.indexOf(searchText) !== -1;
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {this.getLocationSuccess(position);}, this.getLocationError);
    }
  }

  getLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    this.fetchAddress(lat, lon);
  }

  getLocationError(error) {
    console.log('error', error);
  }

  async fetchAddress(lat, lon) {
    const address = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
      .then(response => response.json());

    this.userAddress = address;
    // console.log('user address', this.userAddress);
  }

  async fetchBusinesses() {
    const businesses = await fetch(`http://bob.hasanirogers.local/wp-json/wp/v2/business?per_page=99&_embed`)
      .then(response => response.text())
      .then(text => {
        try {
          return JSON.parse(text);
        } catch (error) {
          console.log(error);
        }
      });

    this.businesses = businesses;
  }
}

/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import { html, css, LitElement } from 'lit-element';
import 'shufflejs/dist/shuffle.js';
import '../../bob-card/bob-card.js';

export class PageMain extends LitElement {
  static get styles() {
    return css`
      .shuffle {
        margin-top: 4rem;
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

      a[selected] {
        color: blue;
      }

      @media screen and (min-width: 769px) {
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
      catFilters: { type: Array },
      userAddress: { type: Object },
      shuffleInstance: { type: Object },
    };
  }

  constructor() {
    super();
    this.businesses = {};
    this.catFilters = [];
  }

  render() {
    let userPostcode;
    let businesses;

    // address block
    if (this.userAddress) {
      userPostcode = html `
        <p>
          <label>
            <input type="checkbox" @change="${(event) => {this.filterPostCode(this.userAddress.address.postcode, event); }}" />
            Only show businesses in ${this.userAddress.address.postcode}.
          </label>
        </p>
      `;
    }

    if (this.businesses.length > 0) {
      businesses = this.businesses.map((business) => {
        const categories = this.getCatArray(business.acf.categories);

        console.log('business', business);

        return html `
          <figure
            class="shuffle__item"
            data-groups="${categories}"
            data-title="${business.title.rendered}"
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
      <nav class="filters">
        Category Select:
        <a tabindex="0" ?selected="${this.catFilters.indexOf('restaurant') > -1}" @click="${() => {this.filterCategory('restaurant');}}">Restaurant</a>
        <a tabindex="0" ?selected="${this.catFilters.indexOf('city') > -1}" @click="${() => {this.filterCategory('city');}}">City</a>
        <a tabindex="0" ?selected="${this.catFilters.indexOf('nature') > -1}" @click="${() => {this.filterCategory('nature');}}">Nature</a>
      </nav>

      ${userPostcode}

      <input type="text" @keyup="${(event) => {this.filterTitle(event)}}" />

      <div class="shuffle">
        ${businesses}
        <!--
        <figure class="shuffle__item" data-groups='["animal"]' data-date-created="2016-08-12" data-title="Crocodile" data-postcode="48075">
          <bob-card
            name="Kuzzos"
            image="https://www.greenmangaming.com/newsroom/wp-content/uploads/2019/05/ff7-remake-blog.jpg"
            address="555 street"
            city="City"
            state="State"
            zip="99999"
            phone="555-555-555"
            website="www.website.com"
            facebook="facebook.com">
          </bob-card>
        </figure>
        <figure class="shuffle__item" data-groups='["city"]' data-date-created="2016-06-09" data-title="Crossroads" data-postcode="48076">
          <bob-card
            title="Crossroads"
            description="A multi-level highway stack interchange in Puxi, Shanghai">
          </bob-card>
        </figure>
        <figure class="shuffle__item" data-groups='["nature"]' data-date-created="2015-10-20" data-title="Central Park" data-postcode="48077">
          <bob-card
            title="Central Park"
            description="Looking down on central park and the surrounding builds from the Rockefellar Center">
          </bob-card>
        </figure>
        <figure class="shuffle__item" data-groups='["animal"]' data-date-created="2015-10-20" data-title="Central Park" data-postcode="48219">
          <bob-card
            title="Cat"
            description="Enuff said.">
          </bob-card>
        </figure>
        <div class="shuffle__sizer"></div>
        -->
      </div>
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
    this.shuffleInstance.filter((element) => {
      if (event.path[0].checked) {
        return element.getAttribute('data-postcode') === postcode;
      }

      return true;
    });
  }

  filterTitle(event) {
    const searchText = event.target.value.toLowerCase();

    this.shuffleInstance.filter((element) => {
      const titleElement = element.querySelector('bob-card');
      const titleText = titleElement.getAttribute('title').toLowerCase();

      return titleText.indexOf(searchText) !== -1;
    });
  }

  addCatFilter(filter) {
    const newfilter = [filter];
    this.catFilters = this.catFilters.concat(newfilter);
    this.shuffleInstance.filter(this.catFilters);
  }

  removeCatFilter(filter) {
    this.catFilters = this.catFilters.filter(e => e !== filter);
    this.shuffleInstance.filter(this.catFilters);
  }

  filterCategory(category) {
    if (this.catFilters.indexOf(category) > -1) {
      // the filter has been applied, remove it
      this.removeCatFilter(category);
    } else {
      // the filter has not been applied, add it
      this.addCatFilter(category);
    }
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

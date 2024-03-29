/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import { html, css, LitElement } from 'lit-element';

import Shuffle from 'shufflejs/dist/shuffle.esm.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';

import { currentEnv, protocol } from '../../bob-app/src/env.js'
import '../../bob-card/bob-card.js';
import '../../bob-catnav/bob-catnav.js';
import '../../bob-loader/bob-loader.js';


export class PageMain extends LitElement {
  static get styles() {
    return css`
      paper-toggle-button {
        display: inline-block;
      }

      label {
        display: flex;
      }

      bob-loader {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .messages {
        margin: auto;
        padding: 0 1rem;
      }

      .messages__too-many-filters,
      .messages__none-in-state {
        display: none;
      }

      .messages__too-many-filters--show,
      .messages__none-in-state--show {
        display: block;
      }

      .shuffle {
        margin: 0 1rem;
        /* height: auto; */
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

      .filters {
        position: relative;
      }

      .filters__location {
        display: flex;
        flex-direction: column;
        max-height: 1px;
        padding: 1rem;
        overflow: hidden;
        transition: all 300ms ease;
      }

      .filters__location:not(:last-child) > * {
        margin-right: 2rem;
      }

      .filters--opened .filters__location {
        max-height: 9999px;
      }

      .filters__toggle {
        cursor: pointer;
        font-size: 2rem;
        display: inline-block;

        position: absolute;
        left: 50%;
        bottom: -1.5rem;

        animation: slideIn 500ms ease-out;
        transition: all 300ms ease;
        transform: translateX(-50%) rotate(90deg);
      }

      .filters--opened .filters__toggle {
        transform: translateX(-50%) rotate(270deg);
      }

      @media screen and (min-width: 769px) {
        .filters {
          padding: 1rem 2rem;
        }

        .filters__location {
          flex-direction: row;
        }

        .filters__toggle {
          bottom: -1rem;
        }

        .shuffle__item {
          width: 33%;
        }
      }

      @keyframes slideIn {
        from { transform: translateY(-4rem) translateX(-50%) rotate(90deg); }
        to { transform: translateY(0) translateX(-50%) rotate(90deg); }
      }
    `;
  }

  static get properties() {
    return {
      // title: { type: String },
      businesses: { type: Object }, // business post data from WordPress
      perPage: { type: Number }, // the number of businesses to show per Page
      totalPages: { type: Number }, // the total number of pages for the businesses
      currentPage: { type: Number }, // the current page of businesses
      userAddress: { type: Object }, // user address info from reverse geocoding
      checkedState: { type: Boolean }, // tracks if user is filtering by state
      checkedPostcode: { type: Boolean }, // tracks if user is filtering by near by zipcodes
      currentCategories: { type: Array }, // user selected categories as reported by <bobcatnav>
      nearByZipCodes: { type: Array }, // near by zip codes returned from /nearbyzips/[ZIP]/[DISTANCE]
      shuffleInstance: { type: Object }, // stores the shuffle.js instance
      tooManyFiltersMsg: { type: Boolean }, // determines whether or not to display no business message
      fetchBusinessesSet: { type: Boolean } // tracks whether or not fetchBusiness has been called at least once
    };
  }

  constructor() {
    super();
    this.businesses = {};
    this.perPage = 9;
    this.currentPage = 1;
    this.checkedState = true;
    this.checkedPostcode = false;
    this.currentCategories = [];
    this.tooManyFiltersMsg = false;
    this.fetchBusinessesSet = false;
  }

  render() {
    let userPostcodeFilter;
    let userStateFilter;
    let locationFilters;
    let businesses;

    if (this.nearByZipCodes) {
      userPostcodeFilter = html `
        <p>
          <label>
            <paper-toggle-button @change="${(event) => {this.filterPostCode(event); }}"></paper-toggle-button>
            <span>Show businesses within 10 milies of <strong>${this.userAddress.address.postcode}</strong>.</span>
          </label>
        </p>
      `;
    }

    if (this.userAddress) {
      userStateFilter = html `
        <p>
          <label>
            <paper-toggle-button checked @change="${(event) => {this.filterState(event); }}"></paper-toggle-button>
            <span>Only show businesses in <strong>${this.userAddress.address.state}</strong>.</span>
          </label>
        </p>
      `;
    }

    if (this.userAddress) {
      locationFilters = html `<span class="filters__toggle" @click="${() => this.toggleLocationFilters()}">›</span>`;
    };

    if (this.businesses.length > 0) {
      businesses = this.businesses.map((business) => {
        const categories = (business.acf) ? this.getCatArray(business.acf.categories) : '';
        const state = (business._embedded && business._embedded['wp:term'][1][0].name) ? business._embedded['wp:term'][1][0].name : '';

        return html `
          <figure
            class="shuffle__item"
            title="${business.title.rendered}"
            data-groups="${categories}"
            data-city="${business.acf.city}"
            data-state="${state}"
            data-postcode="${business.acf.zip}">
            <bob-card
              name="${business.title.rendered}"
              image="${business.acf.cardImage ? business.acf.cardImage.url : ''}"
              address="${business.acf.address}"
              city="${business.acf.city}"
              state="${state}"
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
        ${locationFilters}
      </section>

      <bob-catnav @update-cat-filter=${this.filterCategories}></bob-catnav>

      <section class="messages">
        <p class="messages__too-many-filters ${this.tooManyFiltersMsg ? 'messages__too-many-filters--show' : ''}">Sorry. We can't find any business that meets your current filters. 😞</p>
        <p class="messages__none-in-state ${this.businesses.length === 0 && this.fetchBusinessesSet ? 'messages__none-in-state--show' : ''}">Looks like we haven't added any businesses in your state yet. Try turning off state filtering.</p>
      </section>

      <bob-loader></bob-loader>

      <section class="shuffle">
        ${businesses}
      </section>
    `;
  }

  firstUpdated() {
    const shuffleElement = this.shadowRoot.querySelector('.shuffle');
    const loader = this.shadowRoot.querySelector('bob-loader');

    this.shuffleInstance = new Shuffle(shuffleElement, {
      itemSelector: '.shuffle__item'
    });

    loader.showLoader();
    this.getLocation();

    window.addEventListener('scroll', () => this.handleScroll());
  }

  updated() {
    // when we add cards the instance we need a delay to make sure they're in the DOM
    setTimeout(() => {
      this.shuffleInstance.resetItems();
      this.shuffleInstance.update();
      this.displayTooManyFiltersMsg();
    }, 1);
  }


  displayTooManyFiltersMsg() {
    if (this.shuffleInstance && this.shuffleInstance.visibleItems === 0 && this.businesses.length > 0) {
      this.tooManyFiltersMsg = true;
    } else {
      this.tooManyFiltersMsg = false;
    }
  }

  /**
   * Toggles a modifer of --opened to the .filters container on click
   */
  toggleLocationFilters() {
    this.shadowRoot.querySelector('.filters').classList.toggle('filters--opened');
  }

  /**
   * Takes the category object returned by ACF in REST and transform it to an array suitable for data-groups
   * @param {Object} catObject
   */
  getCatArray(catObject) {
    const catArray = [];

    if (catObject) {
      // map through cat object and push slug to array
      catObject.map((cat) => catArray.push(cat.slug));
    }

    return JSON.stringify(catArray);
  }

  /**
   * Handles the toggle of near by zip codes and calls the master filter function
   * @param {Event} event
   */
  filterPostCode(event) {
    if (event) {
      this.checkedPostcode = event.path[0].checked;
    }

    this.shuffleInstance.filter((element) => this.filterAllItems(element));
  }

  /**
   * Handles th toggle of filtering by State and calls the master filter function
   * @param {Event} event
   */
  filterState(event) {
    if (event) {
      this.checkedState = event.path[0].checked;
      this.currentPage = 0;
      this.fetchBusinesses();
    }

    this.shuffleInstance.filter((element) => this.filterAllItems(element));
  }

  /**
   * Handles keyword search on keypress and calls the master filter function
   * @param {Event} event
   */
  filterTitle(event) {
    this.shuffleInstance.filter((element) => this.filterAllItems(element, event, true, false));
  }


  /**
   * Handles category filter by receiving data from CatNavs' update-cat-filter event. Calls master filter function.
   * @param {Event} event
   */
  filterCategories(event) {
    this.currentCategories = event.detail.currentCategories;
    this.shuffleInstance.filter((element) => this.filterAllItems(element, null, false, true));
  }


  /**
   * The master filter function. Return false to disclude the element from Shuffle Instance.
   * @param {DOMElement} element | the element to be filtered
   * @param {Event} event | the event from its various handlers
   * @param {Boolean} isKeywordSearch | true if called from a keyword search
   * @param {Boolean} isCategorySearch | true if called from a category filter
   */
  filterAllItems(element, event, isKeywordSearch, isCategorySearch) {
    const searchText = event ? event.target.value.toLowerCase() : '';
    const titleText = element.querySelector('bob-card').getAttribute('name').toLowerCase();
    const elementCategories = JSON.parse(element.getAttribute('data-groups'));

    if (this.userAddress) {
      // check State
      // if the user state is not state on the element
      if (this.checkedState && element.getAttribute('data-state') !== this.userAddress.address.state) {
        return false;
      }

      // if the element zip code is not in the near by zip codes
      if (this.checkedPostcode && this.nearByZipCodes.indexOf(element.getAttribute('data-postcode')) === -1) {
        return false;
      }
    }

    // check keyword search
    // if its a keyword search and the user entered text is not in the title of the current element
    if (isKeywordSearch && titleText.indexOf(searchText) === -1) {
      return false;
    }

    // check category
    // basically we look for a subset of arrays using currentCategories and elementCategories
    // stackoverflow: https://stackoverflow.com/questions/38811421/check-if-an-array-is-subset-of-another-array
    if (isCategorySearch && !this.currentCategories.every(value => elementCategories.includes(value))) {
      return false;
    }

    // if it passed all the checks show the element
    return true;
  }

  /**
   * uses geolocation to get the coords of the user's location
   */
  getLocation() {
    if (navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => this.getLocationSuccess(position),
        (error) => this.getLocationError(error)
      );
    }
  }

  /**
   * Handles successfully grabbing the user location
   * @param {Object} position | cordinates of the user
   */
  getLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    this.fetchAddress(lat, lon);
  }

  /**
   * Handles a scenario where coords can't be obtained
   * @param {Object} error
   */
  getLocationError(error) {
    // if they decline to share a location fetch businesses without any address info
    this.fetchBusinesses();

    console.log('error', error);
    this.shuffleInstance.resetItems();
    this.shuffleInstance.update();
  }

  /**
   * Handles scroll detection for adding more cards
   */
  handleScroll() {
    const shuffleBlock = this.shadowRoot.querySelector('.shuffle');
    const shuffleBlockOffset = shuffleBlock.offsetTop + shuffleBlock.clientHeight - 2; // add -2 to trigger slightly before .shuffle ends
    const pageOffset = window.pageYOffset + window.innerHeight;

    if (pageOffset > shuffleBlockOffset) {
      // console.log('end of page scroll detected');
      this.loadMoreCards();
    }
  }

  /**
   * Handles the logic of fetching more cards and loading them into business object
   */
  async loadMoreCards() {
    // console.log('current page', this.currentPage);
    // console.log('total pages', this.totalPages);

    const stateFilter = (this.checkedState && this.userAddress) ? `&filter[taxonomy]=states&filter[term]=${this.userAddress.address.state}` : '';

    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;

      const url = `${protocol}//${currentEnv}/wp-json/wp/v2/business?per_page=${this.perPage}&page=${this.currentPage}${stateFilter}&_embed`;
      const businesses = await fetch(url)
        .then(response => response.json());

      this.businesses = this.businesses.concat(businesses);
    }
  }

  /**
   * Uses Open Street Map to reverse geocode and get the users approx address
   * @param {String} lat | Lattitude
   * @param {String} lon | Longitude
   */
  async fetchAddress(lat, lon) {
    const address = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
      .then(response => response.json());

    this.userAddress = address;

    // fetch businesses after we get an address
    this.fetchBusinesses();

    // apply the state filter as soon as we have an address
    this.filterState();

    // get the nearbyzips as soon as we have an address
    this.fetchZipCodes();
  }

  /**
   * Grabs the businesses and totalPage count from WordPress
   */
  async fetchBusinesses() {
    const loader = this.shadowRoot.querySelector('bob-loader');
    const stateFilter = (this.checkedState && this.userAddress) ? `&filter[taxonomy]=states&filter[term]=${this.userAddress.address.state}` : '';

    const businesses = await fetch(`${protocol}//${currentEnv}/wp-json/wp/v2/business?per_page=${this.perPage}${stateFilter}&_embed`)
      .then(response => {
        this.totalPages = response.headers.get('x-wp-totalpages');
        return response.json();
      });

    this.businesses = businesses;
    loader.hideLoader();
    this.fetchBusinessesSet = true;
  }

  /**
   * Gets the near by zip codes from an Express service
   */
  async fetchZipCodes() {
    const distance = '10';
    const nearByZipCodes = await fetch(`/nearbyzips/${this.userAddress.address.postcode}/${distance}`)
      .then(response => response.text())
      .then(text => {
        try {
          return JSON.parse(text);
        } catch (error) {
          console.log('there was an error fetching near by zipcodes');
        }
      });

    if (nearByZipCodes) this.nearByZipCodes = nearByZipCodes;
  }
}

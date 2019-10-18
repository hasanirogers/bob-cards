/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import { html, css, LitElement } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import 'multiselect-combo-box/multiselect-combo-box.js';

import '../../bob-loader/bob-loader.js';
import { sharedStyles } from '../../bob-app/src/stylesShared.js';
import { templateStates } from './templateStates.js';
import { environments } from '../../bob-app/src/env.js';
import { credentials } from './credentials.js';

export class PageSubmit extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      label > span {
        visibility: hidden;
        position: absolute;
        left: -9999px;
        top: -9999px;
      }

      form > section {
        display: grid;
        grid-gap: 2rem;
        align-items: flex-end;
        grid-template-columns: 1fr;
      }

      .btn {
        width: 100%;
      }

      .location {
        display: grid;
        grid-gap: 2rem;
        grid-template-columns: 1fr;
      }

      .send-business {
        text-align: center;
      }

      @media screen and (min-width: 769px) {
        form > section {
          grid-template-columns: 1fr 1fr;
        }

        .location {
          grid-template-columns: 1fr 1fr 150px 100px;
        }

        .btn {
          display: flex;
          width: auto;
          margin: auto;
          padding: 1rem 4rem;
        }
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      jwt: { type: Object },
    };
  }

  constructor() {
    super();

    this.title = 'Black owned business are dope. Send us one.';
  }

  render() {
    return html`
      ${sharedStyles}
      <h2>${this.title}</h2>
      <p>We can't collect them all on our own. If you know of a great black owned business please submit it here and we'll consider adding it to the app!</p>
      <form novalidate>
        <section class="grid grid--2-columns">
          <p>
            <label>
              <span>Business Name</span>
              <paper-input name="business-name" label="Business Name" required></paper-input>
            </label>
          </p>
          <p>
            <label>
              <span>Categories</span>
              <multiselect-combo-box label="Select Categories"></multiselect-combo-box>
            </label>
          </p>
          <div class="grid-span-all">
            <div class="location">
              <p>
                <label>
                  <span>Address</span>
                  <paper-input name="address" label="Address"></paper-input>
                </label>
              </p>
              <p>
                <label>
                  <span>City</span>
                  <paper-input name="city" label="City" required></paper-input>
                </label>
              </p>
              <p>
                <paper-dropdown-menu label="States">
                  <paper-listbox slot="dropdown-content" selected="1">
                    ${templateStates}
                  </paper-listbox>
                </paper-dropdown-menu>
              </p>
              <p>
                <label>
                  <span>Zip</span>
                  <paper-input name="zipcode" label="Zip Code" required></paper-input>
                </label>
              </p>
            </div>
          </div>
          <p>
            <label>
              <span>Phone</span>
              <paper-input name="phone" label="Phone" requied></paper-input>
            </label>
          </p>
          <p>
            <label>
              <span>Website</span>
              <paper-input name="website" label="Website"></paper-input>
            </label>
          </p>
          <p>
            <label>
              <span>Facebook</span>
              <paper-input name="facebook" label="Facebook"></paper-input>
            </label>
          </p>
        </section>

        <div class="send-business">
          <bob-loader></bob-loader>
          <button class="btn" @click=${(event) => this.handleSubmit(event)}>Send Business</button>
        </div>
      </form>
    `;
  }

  firstUpdated() {
    this.getJWT();
    this.getCategories();
  }

  getCategories() {
    const multiselect = this.shadowRoot.querySelector('multiselect-combo-box');

    multiselect.items = ['Apple', 'Banana', 'Orange'];
  }

  handleSubmit(event) {
    event.preventDefault();

    const name = this.shadowRoot.querySelector('[name="business-name"]');
    const categories = this.shadowRoot.querySelector('multiselect-combo-box');
    const address = this.shadowRoot.querySelector('[name="address"]');
    const city = this.shadowRoot.querySelector('[name="city"]');
    const state = this.shadowRoot.querySelector('[label="States"]');
    const zipcode = this.shadowRoot.querySelector('[name="zipcode"]');
    const phone = this.shadowRoot.querySelector('[name="phone"]');
    const website = this.shadowRoot.querySelector('[name="website"]');
    const facebook = this.shadowRoot.querySelector('[name="facebook"]');

    const businessData = {
      name: name.value,
      categories: categories.items,
      address: address.value,
      city: city.value,
      state: state.value,
      zipcode: zipcode.value,
      phone: phone.value,
      website: website.value,
      facebook: facebook.value,
    }

    this.postBusiness(businessData);
  }

  postBusiness(business) {
    const categories = business.categories.map((category) => `<span>${category}</span>`);
    const loader = this.shadowRoot.querySelector('bob-loader');

    const postData = {
      title: business.name,
      content: `
        <h2>Instructions</h2>
        <p>You'll need to grab the contents from here and manually enter them under "Business Info" after the business has been verified.
        <h3>Categories</h3>
        <p>${categories}</p>
        <h3>Address</h3>
        <p>${business.address} ${business.city} ${business.state}, ${business.zipcode}</p>
        <h3>Phone</h3>
        <p>${business.phone}</p>
        <h3>Online</h3>
        <ul>
          <li>${business.website}</li>
          <li>${business.facebook}</li>
        </ul>
      `
    }

    loader.showLoader();

    fetch(`http://${environments.prodip}/wp-json/wp/v2/business`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.jwt.token}`,
      }),
      body: JSON.stringify(postData)
    })
    .then((data) => {
      console.log('Request success: ', data);
      loader.hideLoader();
    })
    .catch((error) => {
      console.log('Request failure: ', error);
      loader.hideLoader();
    });
  }

  // reference: https://wordpress.stackexchange.com/questions/333728/how-to-authenticate-wp-rest-api-with-jwt-authentication-using-fetch-api
  async getJWT() {
    const token = await fetch(`http://${environments.prodip}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json());

    this.jwt = token;
    // console.log(this.jwt);
  }


}

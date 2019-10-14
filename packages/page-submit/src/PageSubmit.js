/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

import { html, css, LitElement } from 'lit-element';
// import { Base64 } from '../../bob-app/src/base64.js';
import { environments } from '../../bob-app/src/env.js';
import { credentials } from './credentials.js';

export class PageSubmit extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
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
      <h2>${this.title}</h2>
      <p>We can't collect them all on our own. If you know of a great black owned business please submit it here and we'll consider adding it to the app!</p>
      <button @click=${() => this.handleSubmit()}>Test Me</button>
    `;
  }

  firstUpdated() {
    this.getJWT();
  }

  handleSubmit() {
    this.postBusiness();
  }

  postBusiness() {
    const businessData = {
      title: 'A new business!',
    }

    fetch(`http://${environments.prodip}/wp-json/wp/v2/business`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.jwt.token}`,
      }),
      body: JSON.stringify(businessData)
    })
    .then((data) => console.log('Request success: ', data))
    .catch((error) => console.log('Request failure: ', error));
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

    console.log(this.jwt);
  }


}

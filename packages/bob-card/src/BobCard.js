import { html, css, LitElement } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import {
  iconLocation,
  iconFacebook,
  iconPhone,
  iconWebsite,
 } from '../../bob-app/src/svg.js';


export class BobCard extends LitElement {
  static get styles() {
    return css`
      :host {
        --card-radius: 6px;

        color: #ffffff;
        display: block;
        margin: 1rem;
        background: #333333;
        border-radius: var(--card-radius);
        box-shadow: 2px 2px 4px rgba(0,0,0,0.25);
      }

      img {
        max-width: 100%;
        border-top-left-radius: var(--card-radius);
        border-top-right-radius: var(--card-radius);
      }

      svg {
        width: 24px;
        height: 24px;
        margin-right: 0.5rem;
      }

      .content {
        padding: 1rem;
      }

      .address {
        display: flex;
      }

      .phone {
        display: flex;
        align-items: center;
        margin: 1rem 0;
      }

      .online {
        display: flex;
        align-items: center;
        list-style: none;
        padding: 0;
        margin: 0;
        justify-content: flex-end;
      }

      .card {
        position: relative;
      }

      .card--image h3 {
        position: absolute;
        top: 2rem;
        left: 0;

        color: #fff;
        display: block;
        padding: 1rem;
        background: rgba(0,0,0,0.5);
        box-shadow: 1px 1px 1px rgba(0,0,0,0.75);
      }
    `;
  }

  static get properties() {
    return {
      image: { type: String },
      name: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      phone: { type: String },
      website: { type: String },
      facebook: { type: String }
    };
  }

  // constructor() {
  //   super();
  // }

  render() {
    let image;
    let website;
    let facebook;
    let address;

    // image block
    if (this.image && this.image !== '' && this.image !== 'undefined') {
      image = html `<img src="${this.image}" />`;
    }

    // address block
    if (this.address && this.address !== '') {
      address = html `
        <span>${iconLocation}</span>
        <span>${this.address}, ${this.city}, ${this.state} ${this.zip}</span>
      `;
    } else {
      address = html `
        <span>${iconLocation}</span>
        <span>${this.city}</span>
      `
    }

    // website block
    if (this.website && this.website !== '' && this.image !== 'undefined') {
      website = html `
        <li>
          <a href="${this.website}" title="Website" target="_blank">
            ${iconWebsite}
          </a>
        </li>
      `;
    }

    // facebook block
    if (this.facebook && this.facebook !== '') {
      facebook = html `
        <li>
          <a href="${this.facebook}" title="Facebook" target="_blank">
            ${iconFacebook}
          </a>
        </li>
      `;
    }

    return html`
      <div class="${this.image && this.image !== '' && this.image !== 'undefined' ? 'card card--image' : 'card'}">
        ${image}
        <div class="content">
          <h3>${unsafeHTML(this.name)}</h3>
          <div class="address">${address}</div>
          <div class="phone">
            ${iconPhone} ${this.phone}
          </div>
          <ul class="online">
            ${website}
            ${facebook}
          </ul>
        </div>
      </div>
    `;
  }
}

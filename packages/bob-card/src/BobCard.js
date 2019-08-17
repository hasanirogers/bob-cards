import { html, css, LitElement } from 'lit-element';
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
        display: block;
        margin: 1rem;
        background: #fff;
        border-radius: 6px;
        box-shadow: 2px 2px 4px rgba(0,0,0,0.25);
      }

      img {
        max-width: 100%;
      }

      svg {
        width: 24px;
      }

      .content {
        padding: 1rem;
      }

      .online {
        display: inline-flex;
        list-style: none;
        padding: 0;
        margin: 0;
        align-items: bottom;
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

  constructor() {
    super();
    this.title = 'A business.';
  }

  render() {
    let image;
    let website;
    let facebook;

    // image block
    if (this.image && this.image !== '' && this.image !== 'undefined') {
      image = html `<img src="${this.image}" />`;
    }

    // website block
    if (this.website && this.website !== '' && this.image !== 'undefined') {
      website = html `
        <li>
          <a href="${this.website}" target="_blank">
            ${iconWebsite}
            Website
          </a>
        </li>
      `;
    }

    // facebook block
    if (this.facebook && this.facebook !== '') {
      facebook = html `
        <li>
          <a href="${this.facebook}" target="_blank">
            ${iconFacebook}
            Facebook
          </a>
        </li>
      `;
    }

    return html`
      <div class="card">
        ${image}
        <div class="content">
          <h3>${this.name}</h3>
          <div class="address">
            ${iconLocation} ${this.address}, ${this.city}, ${this.state} ${this.zip}
          </div>
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

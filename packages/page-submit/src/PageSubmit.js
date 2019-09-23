import { html, css, LitElement } from 'lit-element';

export class PageSubmit extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1.5rem;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      // counter: { type: Number },
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
    `;
  }
}

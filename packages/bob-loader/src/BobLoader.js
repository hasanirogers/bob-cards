import { html, css, LitElement } from 'lit-element';

export class BobLoader extends LitElement {
  static get styles() {
    return css`
      :host {
        visibility: hidden;
        margin: 1rem auto;
      }

      :host([loading]) {
        visibility: visible;
      }

      .lds-ripple {
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
      }
      .lds-ripple div {
        position: absolute;
        border: 4px solid #fff;
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      }
      .lds-ripple div:nth-child(2) {
        animation-delay: -0.5s;
      }
      @keyframes lds-ripple {
        0% {
          top: 28px;
          left: 28px;
          width: 0;
          height: 0;
          opacity: 1;
        }
        100% {
          top: -1px;
          left: -1px;
          width: 58px;
          height: 58px;
          opacity: 0;
        }
      }
    `;
  }

  static get properties() {
    return {
      loading: { // tracks whether or not loading is active
        type: Boolean,
        reflect: true
      },
    };
  }

  constructor() {
    super();

    this.loading = false;
  }

  render() {
    return html`
      <div class="lds-ripple"><div></div><div></div></div>
    `;
  }

  showLoader() {
    this.loading = true;
  }

  hideLoader() {
    this.loading = false;
  }
}

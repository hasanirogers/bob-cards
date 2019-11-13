import { html, css, LitElement } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { sharedStyles } from '../../bob-app/src/stylesShared.js';
import { currentEnv } from '../../bob-app/src/env.js';

export class PageContributors extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      section {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 2rem;
        margin-top: 2rem;
      }

      figure {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        margin: 0;
      }

      figure p {
        text-align: justify;
      }

      img {
        max-width: 140px;
        margin-right: 1rem;
        border-radius: 6px;
      }

      h3,
      h4 {
        margin: 0;
      }

      h4 {
        font-weight: normal;
      }

      @media screen and (min-width: 769px) {
        section {
          grid-template-columns: 1fr 1fr;
        }

        figure {
          flex-direction: row;
        }
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      contributors: { type: Object },
    };
  }

  constructor() {
    super();

    this.title = 'Contributions';
    this.contributors = {};
  }

  render() {
    let contributors;
    let photo;

    if (this.contributors.length > 0) {
      contributors = this.contributors.map((contributor) => {
        if (contributor.acf.photo.url) {
          photo = html `<div><img src="${contributor.acf.photo.url}" /></div>`;
        }

        return html`
          <div>
            <figure>
              ${photo}
              <figcaption>
                <h3>${contributor.title.rendered}</h3>
                <h4>${contributor.acf.role}</h4>
                ${unsafeHTML(contributor.content.rendered)}
              </figcaption>
            </figure>
          </div>
        `;
      });
    }

    return html`
      ${sharedStyles}
      <h2>${this.title}</h2>
      <p>Building a quality app is not a single handed effort. Meet the people behind this app.</p>

      <section>
        ${contributors}
      </section>
    `;
  }

  firstUpdated() {
    this.fetchContributors();
  }

  async fetchContributors() {
    const contributors = await fetch(`https://${currentEnv}/wp-json/wp/v2/contributor?per_page=99&_embed`)
      .then(response => response.json());

    this.contributors = contributors;
  }
}

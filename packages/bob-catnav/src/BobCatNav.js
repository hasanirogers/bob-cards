/* eslint-disable class-methods-use-this */

import { html, css, LitElement } from 'lit-element';
import { environments } from '../../bob-app/src/env.js'


export class BobCatNav extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      nav {
        min-width: 960px;
        padding: 0 1rem;
        border-radius: 1rem;
        display: flex;
        justify-content: space-around;
        background: var(--bob-dark-gray);
      }

      div {
        overflow: auto;
        margin: 2rem 1rem;
      }

      a {
        cursor: pointer;
        padding: 1rem;
      }

      a[selected] {
        color: var(--bob-primary-color);
        background: rgba(0, 0, 0, 0.25);
      }
    `;
  }

  static get properties() {
    return {
      categories: { type: Array }, // All categories pull from WordPress
      catFilters: { type: Array }, // The categories the user has selected
    };
  }

  constructor() {
    super();

    this.categories = [];
    this.catFilters = [];
  }

  render() {
    let filteredCats;
    let categories;

    if (this.categories.length > 0) {
      // create a new array that removes uncategorized
      filteredCats = this.categories.filter((category) => category.slug !== 'uncategorized');

      categories = filteredCats.map((category) => html`
          <a
            tabindex="0"
            ?selected="${this.catFilters.indexOf(category.slug) > -1}"
            @click="${() => {this.filterCategory(category.slug);}}">
            ${category.name}
          </a>
        `
      );
    }

    return html`
      <div>
        <nav>${categories}</nav>
      </div>
    `;
  }

  firstUpdated() {
    this.getAllCategories();
  }

  addCatFilter(filter) {
    const newfilter = [filter];
    this.catFilters = this.catFilters.concat(newfilter);

    this.dispatchEvent(new CustomEvent('update-cat-filter', {
      detail: {
        currentCategories: this.catFilters,
        allCategories: this.categories,
      }
    }));
  }

  removeCatFilter(filter) {
    this.catFilters = this.catFilters.filter(e => e !== filter);

    this.dispatchEvent(new CustomEvent('update-cat-filter', {
      detail: {
        currentCategories: this.catFilters,
        allCategories: this.categories,
      }
    }));
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

  async getAllCategories() {
    const categories = await fetch(`http://${environments.prodip}/wp-json/wp/v2/categories`)
      .then(response => response.json());

    this.categories = categories;
  }
}

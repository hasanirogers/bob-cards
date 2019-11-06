/* eslint-disable no-restricted-globals */
/* eslint-disable experimentalDecorators */

import { LitElement, html, css } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@polymer/paper-input/paper-input.js';

import { templateFooter } from './templateFooter.js';
import { sharedStyles } from './stylesShared.js';

import '../../page-main/page-main.js';
import '../../page-submit/page-submit.js';
import '../../page-contributors/page-contributors.js';

import {
  iconSearch,
  iconApp,
} from './imagesSvg.js';


export class BobApp extends LitElement {

  static get styles() {
    return [
      css`
        vaadin-tabs {
          margin-top: 2rem;
          border-bottom: 1px solid #404040;
        }

        vaadin-tab {
          color: var(--bob-primary-text-color);
        }

        vaadin-tab[selected] {
          color: var(--bob-primary-color);
        }

        header {
          display: flex;
          flex-direction: column;
          padding: 0 1rem;
        }

        header > * {
          flex: 1;
        }

        header h1 {
          color: var(--bob-white);
          font-style: italic;
          letter-spacing: 1px;
          margin: 0;
        }

        .logo {
          display: flex;
          padding: 1rem 0;
          align-items: center;
        }

        #iconApp {
          width: 54px;
          height: 54px;
          margin-right: 0.5rem;
        }

        #iconSearch {
          width: 24px;
          fill: var(--primary-text-color);
        }

        @media screen and (min-width: 769px) {
          vaadin-tabs {
            margin-top: 0;
          }

          header {
            flex-direction: row;
          }

          header > :last-child {
            max-width: 33%;
            flex: 0 0 33%;
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      tabs: { type: Array },
      smallScreen: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.page = location.pathname === '/' ? 'main' : location.pathname.replace('/', '');
    this.tabs = ['main', 'submit', 'contributors'];

    installMediaQueryWatcher(`(min-width: 768px)`, (matches) => {
      this.smallScreen = !matches;
    });
  }

  render() {
    let search;

    // search block
    if (this.page === 'main') {
      search = html `
        <div>
          <paper-input @keyup="${(event) => {this.filterTitle(event)}}" placeholder="Search by name.">
            <div slot="suffix">${iconSearch}</div>
          </paper-input>
        </div>
      `;
    }

    return html`
      ${sharedStyles}
      <header>
        <div class="logo">
          <div>${iconApp}</div>
          <div>
            <h1>Bob Cards</h1>
            <aside>Bob's are blacked owned business.</aside>
          </div>
        </div>
        ${search}
      </header>

      <vaadin-tabs orientation="horizontal" selected="${this.tabs.indexOf(this.page)}" theme="centered">
        <vaadin-tab @click=${() => this.switchRoute('')}>Businesses</vaadin-tab>
        <vaadin-tab @click=${() => this.switchRoute('submit')}>Submit a Business</vaadin-tab>
        <vaadin-tab @click=${() => this.switchRoute('contributors')}>Contributors</vaadin-tab>
      </vaadin-tabs>

      <main>
        <section id="outlet"></section>
      </main>

      ${templateFooter}
    `;
  }

  firstUpdated() {
    // this is where the page components are injected
    const router = new Router(this.shadowRoot.getElementById('outlet'));

    // this is the configuration of the routes
    router.setRoutes([
      {path: '/', component: 'page-main'},
      {path: '/submit', name: 'submit', component: 'page-submit'},
      {path: '/contributors', name: 'contributors', component: 'page-contributors'},
      {path: '(.*)', redirect: '/main', action: () => { this.page = 'main'; }}
    ]);
  }

  /**
   * A helper that handles switching pages
   * @param {string} route
   */
  switchRoute(route) {
    this.page = route;
    if (route === '' || route === '/') this.page = 'main';
    Router.go(`/${route}`);
  }

  /**
   * a wrapper to use filterTitle method of <page-main>
   * this is nesscessary because shuffleInstance exists on <page-main>
   * @param {KeyboardEvent} event
   */
  filterTitle(event) {
    const mainPage = this.shadowRoot.querySelector('page-main');
    mainPage.filterTitle(event); // call filterTitle from <page-main>
  }
}

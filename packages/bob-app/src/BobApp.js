/* eslint-disable no-restricted-globals */
/* eslint-disable experimentalDecorators */

import { LitElement, html, css } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@polymer/paper-input/paper-input.js';

import '../../page-main/page-main.js';
import '../../page-one/page-one.js';

import {
  iconSearch,
} from './svg.js';


export class BobApp extends LitElement {

  static get styles() {
    return [
      css`
        vaadin-tabs {
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

        header > h1 {
          flex: 1;
        }

        svg {
          fill: var(--primary-text-color);
        }

        #iconSearch {
          width: 24px;
        }

        @media screen and (min-width: 769px) {
          header {
            flex-direction: row;
          }

          header > div {
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
    this.tabs = ['main', 'one'];

    installMediaQueryWatcher(`(min-width: 768px)`, (matches) => {
      this.smallScreen = !matches;
    });
  }

  render() {
    return html`
      <header>
        <h1>Black Owned Businesses</h1>
        <div>
          <paper-input @keyup="${(event) => {this.filterTitle(event)}}" placeholder="Search by name.">
            <div slot="suffix">${iconSearch}</div>
          </paper-input>
        </div>
      </header>

      <vaadin-tabs orientation="horizontal" selected="${this.tabs.indexOf(this.page)}" theme="centered">
        <vaadin-tab @click=${() => this.switchRoute('')}>Main</vaadin-tab>
        <vaadin-tab @click=${() => this.switchRoute('one')}>One</vaadin-tab>
      </vaadin-tabs>

      <main>
        <section id="outlet"></section>
      </main>
    `;
  }

  firstUpdated() {
    const router = new Router(this.shadowRoot.getElementById('outlet'));
    router.setRoutes([
      {path: '/', component: 'page-main'},
      {path: '/one', name: 'one', component: 'page-one'},
      {path: '(.*)', redirect: '/main', action: () => { this.page = 'main'; }}
    ]);
  }

  switchRoute(route) {
    this.page = route;
    Router.go(`/${route}`);
  }

  filterTitle(event) {
    const mainPage = this.shadowRoot.querySelector('page-main');
    mainPage.filterTitle(event);
  }
}

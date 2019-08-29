/* eslint-disable no-restricted-globals */
/* eslint-disable experimentalDecorators */

import { LitElement, html, css } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import '@polymer/paper-input/paper-input.js';

import '../../page-main/page-main.js';
import '../../page-one/page-one.js';


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

    installMediaQueryWatcher(`(min-width: 640px)`, (matches) => {
      this.smallScreen = !matches;
    });
  }

  render() {
    return html`
      <header>
        <div>Business Cards</div>
        <div>
          <paper-input @keyup="${(event) => {this.filterTitle(event)}}" placeholder="Search for a business by name."></paper-input>
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
}

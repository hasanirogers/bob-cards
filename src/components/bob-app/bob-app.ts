import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import styles from './styles';
import routes from '../../routes';

import '../bob-header/bob-header';
import '../bob-home/bob-home';
import '../bob-profile/bob-profile';
import '../bob-login/bob-login';

@customElement('bob-app')
export class BobApp extends LitElement {
  static styles = [styles];

  @query('main')
  main!: HTMLElement;

  firstUpdated() {
    const router = new Router(this.main);
    router.setRoutes(routes);
  }

  render() {
    return html`
      <bob-header></bob-header>
      <main></main>
    `
  }

  switchRoute(route: string, title: string) {
    document.title = title;
    Router.go(`/${route}`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bob-app': BobApp
  }
}

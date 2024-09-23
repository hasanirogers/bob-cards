import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import alertStore, { IAlertStore } from '../../store/alert';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import routes from '../../routes';

import '../bob-header/bob-header';
import '../bob-home/bob-home';
import '../bob-profile/bob-profile';
import '../bob-login/bob-login';
import KemetAlert from 'kemet-ui/dist/components/kemet-alert/kemet-alert';

export enum ENUM_ALERT_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
  STANDARD = 'standard',
  WARNING = 'warning',
  PRIMARY = 'primary',
}

@customElement('bob-app')
export class BobApp extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('main')
  main!: HTMLElement;

  @query('kemet-alert')
  kemetAlert!: KemetAlert;

  constructor() {
    super();
    alertStore.subscribe((state) => {
      this.alertState = state;
    });
  }

  firstUpdated() {
    const router = new Router(this.main);
    router.setRoutes(routes);
  }

  render() {
    const { status, message, opened, icon } = this.alertState;

    return html`
      <kemet-alert
        closable
        overlay=""
        status="${status as ENUM_ALERT_STATUS}"
        ?opened=${opened}
        @kemet-alert-closed=${() => alertStore.setState({ opened: false })}
      >
        <div>
          <kemet-icon icon="${icon}" size="24"></kemet-icon>&nbsp;
          <div>${message}</div>
        </div>
      </kemet-alert>
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

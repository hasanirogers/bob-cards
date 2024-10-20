import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import alertStore, { IAlertStore } from '../../store/alert';
import appStore, { IAppStore } from '../../store/app';
import userStore, { IUserStore } from '../../store/user';
import geoStore, { IGeoStore } from '../../store/geo';
import { setGeoLocation, switchRoute } from '../../shared/utilities';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import routes from '../../routes';
import nav from './nav';
import KemetAlert from 'kemet-ui/dist/components/kemet-alert/kemet-alert';

import '../bob-header/bob-header';
import '../bob-home/bob-home';
import '../bob-profile/bob-profile';
import '../bob-login/bob-login';
import '../bob-add/bob-add';
import '../bob-mine/bob-mine';


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

  @state()
  appState: IAppStore = appStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  // @state()
  // geoState: IGeoStore = geoStore.getInitialState();

  @query('main')
  main!: HTMLElement;

  @query('kemet-alert')
  kemetAlert!: KemetAlert;

  constructor() {
    super();

    alertStore.subscribe((state) => {
      this.alertState = state;
    });

    appStore.subscribe((state) => {
      this.appState = state;
    });

    userStore.subscribe((state) => {
      this.userState = state;
    });

    setGeoLocation();
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
      <kemet-drawer overlay side="right" effect="push" ?opened=${this.appState.isDrawerOpened}>
        <aside slot="navigation">
          ${this.userState.isLoggedIn ? html`
            <figure>
              <button @click=${() => switchRoute('profile', 'BobCards | Profile')}>
                <img src=${this.userState.profile.meta.bob_profile_image} alt="Profile picture" style="max-width:100%; border-radius: 50%;" />
              </button>
              <figcaption>Hello ${this.userState.profile.username}.</figcaption>
              <p><button @click=${() => this.userState.logout()}>Log Out</button>.</p>
            </figure>
            <nav>${nav}</nav>
          ` : html`
            <figure>
              <kemet-button variant="rounded" @click=${() => switchRoute('login', 'Login')}>Login</kemet-button>
            </figure>
          `}
        </aside>
        <section slot="content">
          <bob-header></bob-header>
          <main></main>
        </section>
      </kemet-drawer>
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

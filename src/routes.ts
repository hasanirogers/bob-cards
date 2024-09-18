import { switchRoute } from './shared/utilities';
import userStore from './store/user';

const userState = userStore.getInitialState();

const redirectHomeWhenLoggedIn = () => {
  if (userState.isLoggedIn) {
    switchRoute('home');
  }
}

const redirectHomeWhenNotLoggedIn = () => {
  if (!userState.isLoggedIn) {
    switchRoute('home');
  }
}

export default [
  { path: '/', component: 'bob-home' },
  { path: '/home', component: 'bob-home' },
  { path: '/profile', component: 'bob-profile', redirectHomeWhenNotLoggedIn },
  { path: '/login', component: 'bob-login', action: redirectHomeWhenLoggedIn }
];

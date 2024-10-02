import appStore from '../store/app';

export const switchRoute = (route: string, title: string = 'BobCards') => {
  const bobApp = document.querySelector('bob-app');
  bobApp?.switchRoute(route, title);
  appStore.setState({ isDrawerOpened: false });
}

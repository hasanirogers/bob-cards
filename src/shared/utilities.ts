import appStore from '../store/app';

export const switchRoute = (route: string, title: string = 'BobCards') => {
  const bobApp = document.querySelector('bob-app');
  bobApp?.switchRoute(route, title);
  appStore.setState({ isDrawerOpened: false });
}

export const emitEvent = (element: HTMLElement, name: string, detail = {}, bubbles = true, composed = true) => {
  element.dispatchEvent(
    new CustomEvent(name, { bubbles, composed, detail }),
  );
};

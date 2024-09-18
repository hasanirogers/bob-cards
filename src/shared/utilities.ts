export const switchRoute = (route: string, title: string = 'BobCards') => {
  const bobApp = document.querySelector('bob-app');
  bobApp?.switchRoute(route, title);
}

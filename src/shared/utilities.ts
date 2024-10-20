import appStore from '../store/app';
import geoStore from '../store/geo';

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


export const setGeoLocation = () => {
  if (navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
      async (position) => {
        geoStore.setState({ coords: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }})

        const address = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
          .then((response) => response.json());

        geoStore.setState({ address: address });
      },
      (error) => {
        console.error(error);
      }
    );
  }
}

export const abbreviateState = (fullStateString: string): string => {
  const states = [
    {
      full: 'Michigan',
      abbreviation: 'MI',
    },
    {
      full: 'Illinois',
      abbreviation: 'IL',
    }
  ];

  const userState = states.find((state: any) => {
    if (state.full === fullStateString) {
      return true;
    }
  });

  return userState?.abbreviation || '';
}

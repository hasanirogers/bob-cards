import { createStore } from 'zustand/vanilla';

export interface IAppStore {
  isMobile: boolean;
  isDrawerOpened: boolean;
  setIsDrawerOpened: (isDrawerOpened: boolean) => void;
}

const isMobile = () => {
  if (matchMedia('(min-width: 769px)').matches) {
    return false;
  }
  return true;
}

const store = createStore<IAppStore>(set => ({
  isMobile: isMobile(),
  isDrawerOpened: false,
  setIsDrawerOpened: (isDrawerOpened: boolean) => set(() => { return { isDrawerOpened } }),
}));

window.addEventListener('resize', () => {
  store.setState({ isMobile: isMobile() });
});

window.addEventListener('kemet-drawer-closed', () => {
  store.setState({ isDrawerOpened: false });
});

export default store;

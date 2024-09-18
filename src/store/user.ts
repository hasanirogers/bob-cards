import { createStore } from 'zustand/vanilla';
import Cookies from 'js-cookie';

export interface IUserStore {
  user: any;
  // setUser: (user: any) => void;
  isLoggedIn: boolean;
  login: (loginData: any) => void;
  logout: () => void;
}

const store = createStore<IUserStore>(set => ({
  user: Cookies.get('bob-user') ? JSON.parse(Cookies.get('bob-user') || '') : {},
  isLoggedIn: !!Cookies.get('bob-user'),
  login: (loginData) => set(() => {
    Cookies.set('bob-user', JSON.stringify(loginData), { expires: 7 });
    return { isLoggedIn: true, user: loginData };
  }),
  logout: () => set(() => {
    Cookies.remove('bob-user');
    return { isLoggedIn: false };
  })
}));

export default store;

import { DirectiveResult } from 'lit/async-directive.js';
import { UnsafeHTMLDirective } from 'lit/directives/unsafe-html.js';
import { createStore } from 'zustand/vanilla';

export interface IAlertStore {
  message: string | DirectiveResult<typeof UnsafeHTMLDirective>;
  setMessage: (message: string | DirectiveResult<typeof UnsafeHTMLDirective>) => void;
  status: string;
  setStatus: (status: string) => void;
  opened: boolean;
  setOpened: (opened: boolean) => void;
  icon: string;
  setIcon: (icon: string) => void;
}

const store = createStore<IAlertStore>(set => ({
  message: '',
  setMessage: (message: string | DirectiveResult<typeof UnsafeHTMLDirective>) => set(() => { return { message } }),
  status: 'standard',
  setStatus: (status: string) => set(() => { return { status } }),
  opened: false,
  setOpened: (opened: boolean) => set(() => { return { opened } }),
  icon: 'info',
  setIcon: (icon: string) => set(() => { return { icon } }),
}));

export default store;

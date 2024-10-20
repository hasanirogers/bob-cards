import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export interface ICoords {
  lat: number | null;
  lng: number | null;
}

export interface IGeoStore {
  coords: ICoords | null;
}

const store = createStore(
  persist(
    (set, get) => ({
      coords: null,
      address: null,
    }),
    {
      name: 'bob-geo',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default store;

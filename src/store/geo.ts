import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

export interface ICoords {
  lat: number | null;
  lng: number | null;
}

export interface IGeoStore {
  coords: ICoords | null;
  address: any;
}

const store = create(
  persist<IGeoStore>(
    () => ({
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

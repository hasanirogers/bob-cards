import { createStore } from 'zustand/vanilla';
import geoStore from './geo';

export interface IFilterStore {
  nearby: boolean;
  setNearby: (nearby: boolean) => void;
  onlyInState: boolean;
  setOnlyInState: (onlyInState: boolean) => void;
  region: string;
  zipCodes: string[];
}

const geo = geoStore.getState() as any;

const getZipCodes = async (zipCode: string | null): Promise<any> => {
  const response = await fetch(`https://secure.geonames.org/findNearbyPostalCodesJSON?postalcode=${zipCode}&country=USA&radius=30&username=zerodivide85`)
    .then((response) => response.json());

  const zipCodesArray: string[] = [];

  if (zipCode) {
    response.postalCodes.map((postalCode: any) => {
      zipCodesArray.push(postalCode.postalCode)
    });
  }

  return zipCodesArray;
}

const zipCodes = await getZipCodes(geo?.address?.address?.postcode || null);

const store = createStore<IFilterStore>(set => ({
  nearby: false,
  setNearby: (nearby: boolean) => set(() => { return { nearby } }),
  onlyInState: false,
  setOnlyInState: (onlyInState: boolean) => set(() => { return { onlyInState } }),
  region: geo.address?.address?.state ? geo?.address?.address?.state : '',
  zipCodes: zipCodes
}));

export default store;

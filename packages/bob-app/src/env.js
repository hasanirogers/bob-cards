/* eslint-disable no-console */
const environments = {
  local: 'bobcards.deificarts.com',
  prod: 'bobcards.deificarts.com',
};

// export const currentEnv = environments.local;
export const currentEnv = environments.prod;

export const protocol = currentEnv === environments.prod ? 'https:' : window.location.protocol;

/* eslint-disable no-console */
const environments = {
  local: 'api.bobcards.local',
  prod: 'api.bobcards.app:4434',
}

// export const currentEnv = environments.local;
export const currentEnv = environments.prod;

export const protocol = (currentEnv === environments.prod) ? 'https:' : window.location.protocol;

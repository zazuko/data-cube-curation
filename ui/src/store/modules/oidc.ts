import { vuexOidcCreateStoreModule } from 'vuex-oidc'

export const oidc = vuexOidcCreateStoreModule({
  // authority: process.env.AUTH_AUTHORITY,
  // client_id: process.env.AUTH_CLIENT_ID,
  authority: 'https://auth.lindas.admin.ch/realms/ref',
  clientId: 'datacube-zazukoians',
  redirectUri: window.location.origin + '/oidc-callback',
  responseType: 'code',
  scope: 'profile',
})

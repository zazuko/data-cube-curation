import { vuexOidcCreateStoreModule } from 'vuex-oidc'

export const oidc = () => vuexOidcCreateStoreModule({
  redirectUri: window.location.origin + '/app/oidc-callback',
  responseType: 'code',
  automaticSilentRenew: true,
  ...window.oidc,
}, {
  routeBase: '/app/',
})

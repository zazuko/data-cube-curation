import { vuexOidcCreateStoreModule } from 'vuex-oidc'

export const oidc = () => vuexOidcCreateStoreModule({
  redirectUri: window.location.origin + '/app/oidc-callback',
  responseType: 'code',
  ...window.oidc,
}, {
  routeBase: '/app/',
})

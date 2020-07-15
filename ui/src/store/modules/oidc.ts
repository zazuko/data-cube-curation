import { vuexOidcCreateStoreModule } from 'vuex-oidc'

export const oidc = () => vuexOidcCreateStoreModule({
  redirectUri: window.location.origin + '/app/oidc-callback',
  responseType: 'code',
  scope: 'profile pipelines:read pipelines:write',
  ...window.oidc,
}, {
  routeBase: '/app/',
})

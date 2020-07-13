import { vuexOidcCreateStoreModule } from 'vuex-oidc'

export const oidc = vuexOidcCreateStoreModule({
  ...window.config.oidc,
  redirectUri: window.location.origin + '/oidc-callback',
  responseType: 'code',
  scope: 'profile pipelines:read pipelines:write',
})

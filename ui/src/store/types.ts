import { VuexOidcState } from 'vuex-oidc'
import { ErrorMessage } from '@/types'

export interface RootState {
  errors: ErrorMessage[];
  rdfProperties: string[];
  oidc?: VuexOidcState
}

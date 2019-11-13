import { RootState } from '@/store/types'
import { ActionContext } from 'vuex'

export async function handleAPIError (context: ActionContext<any, RootState>, f: () => Promise<any>): Promise<any> {
  try {
    return await f()
  } catch (error) {
    if (error.details) {
      context.commit('storeError', error.details, { root: true })
    } else {
      throw error
    }
  }
}

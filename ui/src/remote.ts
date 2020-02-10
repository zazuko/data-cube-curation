
import { RemoteData } from '@/types'

function loading<T> (): RemoteData<T> {
  return { isLoading: true, data: null, error: null }
}

function loaded<T> (data: any): RemoteData<T> {
  return { isLoading: false, data, error: null }
}

function error<T> (error: any): RemoteData<T> {
  return { isLoading: false, data: null, error: error }
}

export default {
  loading,
  loaded,
  error,
}

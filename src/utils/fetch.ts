import axios, { AxiosRequestConfig } from 'axios'

type TFetchResponse<T> = Promise<T | {error: string}>

export const fetchWithErrorHandling = async <T>(
  url: string,
  token?: string,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (options.method) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const message = `Trying to ${options.method || 'GET'} from ${url}`
  console.log(message)

  const response = await axios({
    url,
    headers,
    // timeout: 10000,
    validateStatus: (status: number) => status >= 200 && status < 400,
    ...options,
  })
    .catch((e) => {
      console.error('Error with ', e)
      if ('response' in e && e.response.status === 500) {
        return { error: 'エラーが発生しました。しばらく置いてから再度お試しください。' }
      }
      if ('response' in e && e.response.data instanceof Object && 'error' in e.response.data) {
        return { error: e.response.data.error as string }
      }
      if (e instanceof Error) {
        return { error: e.message }
      }
      return { error: '不明なエラーが発生しました。' }
    })

  if ('error' in response) {
    return { error: response.error }
  }

  return response.data
}

export const get = <T>(
  url: string,
  token: string | undefined,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  return fetchWithErrorHandling<T>(
    url,
    token,
    {
      method: 'GET',
      ...options,
    },
  )
}

export const post = <T>(
  url: string,
  token: string | undefined,
  body: Record<string, unknown> | FormData | File,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  const data = JSON.stringify(body || {})
  return fetchWithErrorHandling(url, token, {
    method: 'POST',
    data,
    ...options,
  })
}

export const put = <T>(
  url: string,
  token: string | undefined,
  body: Record<string, unknown> | FormData | File,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  const data = JSON.stringify(body || {})
  return fetchWithErrorHandling(url, token, {
    method: 'PUT',
    data,
    ...options,
  })
}

export const destroy = <T>(
  url: string,
  token: string | undefined,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  return fetchWithErrorHandling(url, token, { method: 'DELETE', ...options })
}

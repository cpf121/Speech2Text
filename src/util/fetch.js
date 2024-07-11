import { stringifyQuery } from 'vue-router'

export function createFetchOptions(options) {
  const fetchOpt = {
    method: options.method ?? 'POST'
  }
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  switch (fetchOpt.method) {
    case 'POST': {
      if (options.payload instanceof FormData) {
        headers.append('Content-Type', 'multipart/form-data')
        fetchOpt.body = options.payload
      } else {
        headers.append('Content-Type', 'application/json')
        fetchOpt.body = JSON.stringify(options.payload)
      }
      break
    }
    default: {
      break
    }
  }

  if (options.signal) {
    fetchOpt.signal = options.signal
  }
  fetchOpt.headers = headers
  return fetchOpt
}

export function fetchNormal(url, opt = {}) {
  return fetch(url, createFetchOptions(opt))
}

async function requestWithFetch(url, options) {
  const fetchOpt = createFetchOptions(options)

  switch (fetchOpt.method) {
    case 'GET': {
      // 由业务自己保证 payload 可以被序列化到url
      /** 请求参数 */
      const queryStr = stringifyQuery(options.payload)
      // 确定请求参数不为空再执行拼接操作
      if (queryStr) {
        const haveSearch = url.includes('?')
        if (haveSearch) {
          url += '&'
        } else {
          url += '?'
        }

        url += queryStr
      }
      break
    }
    case 'POST': {
      break
    }
    default: {
      throw new Error(`unknown request method: ${options.method}`)
    }
  }
  debugger
  const res = await fetch(url, fetchOpt)
  /** 统一做json解码，非json的请求出现之后再考虑适配 */
  const content = await res.json()

  if (res.ok) {
    return content
  } else {
    throw new Error(content.message)
  }
}

export { requestWithFetch }

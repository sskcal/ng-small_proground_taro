import Taro from '@tarojs/taro'
import { getStorage } from './storage'


const baseUrl = 'https://sm.xiaohainan.cn/api/v1/sm'



export default {
  async baseOptions(params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    const {token} = await getStorage("userInfo")
    const option = {
      url: url.indexOf('http') !== -1 ? url : baseUrl + url,
      data: data,
      method: method as "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined,
      header: { authorization: token }
    }
    return new Promise((resolve, reject) => {
      Taro.request(option).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  get(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option)
  },
  post: function (url, data?: object, contentType?: string) {
    let params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  },
  put(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  },
  delete(url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}

import axios from 'axios'
import { message } from 'antd'

export default function ajax (method = 'GET', url = '', data = {}) {

  return new Promise((resolve) => {
    let promise
    // get请求
    if (method === 'GET') {
      promise = axios.get(url, {
        params: data
      })
    }
    // post请求
    if (method === 'POST') {
      promise = axios.post(url, data)
    }
    // 处理正常的响应
    promise.then(response => {
      resolve(response)
      //处理错误的请求
    }).catch(error => {
      message.error('请求失败:'+ error.message)
    })
  })


}


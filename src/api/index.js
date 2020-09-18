/*
* 网络接口模块
* 返回值均为Promise对象*/
import ajax from './ajax'

const loginRequest = loginInfo => ajax('POST', '/login', loginInfo)




export {
  loginRequest,

}


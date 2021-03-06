/*
* 网络接口模块
* 返回值均为Promise对象*/
import { ajax,cancel } from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

const loginRequest = loginInfo =>
  ajax('POST', '/login', loginInfo)

const weatherRequest = (location) => {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve) => {
    jsonp(url, {}, (error, data) => {
      if (!error && data.status === 'success') {
        const { date, dayPictureUrl, weather } = data.results[0].weather_data[3]
        resolve({ date, dayPictureUrl, weather })
      } else {
        message.error('获取天气信息失败')
      }
    })
  })
}
const getCategoriesRequest = parentId =>
  ajax('GET', '/manage/category/list', { parentId })

const getCategoryRequest = categoryId =>
  ajax('GET', '/manage/category/info' , { categoryId })

// categoryInfo:{类别名categoryName, 父级类别parentId}
const addCategoryRequest = ({ categoryName, parentId }) =>
  ajax('POST', '/manage/category/add', {
  parentId: parentId, categoryName: categoryName
})

// updateCategoryInfo:{新类别名categoryName, 类别Id categoryId}
const updateCategoryRequest = ({ categoryName, categoryId }) =>
  ajax('POST', '/manage/category/update', {
  categoryId: categoryId, categoryName: categoryName
})

const getProductListRequest = (pageNum, pageSize) =>
  ajax('GET', '/manage/product/list', { pageNum, pageSize })

const searchProductRequest = (pageNum, pageSize, keyword, searchType) =>
  ajax('GET', '/manage/product/search', { pageNum, pageSize, [searchType]: keyword })

// newProductInfo = {categoryId,pCategoryId,name,price,desc,imgs}
const addProductRequest = newProductInfo =>
  ajax('POST', '/manage/product/add', newProductInfo)

const updateProductRequest = editedProductInfo =>
  ajax('POST', '/manage/product/update', editedProductInfo)

const updateProductStatusRequest = (productId, status) =>
  ajax('POST', '/manage/product/updateStatus', {productId, status})

const deleteImageRequest = name =>
  ajax('POST','/manage/img/delete', {name})

const getRolesRequest = () =>
  ajax('GET', '/manage/role/list')

const addRoleRequest = roleName =>
  ajax('POST', '/manage/role/add', {roleName})

const updateRoleRequest = role =>
  ajax('POST', '/manage/role/update', role)

const deleteRoleRequest = roleId =>
  ajax('POST', '/manage/role/delete', {roleId})

const getUsersRequest = () =>
  ajax('GET', '/manage/user/list')

const addUserRequest = (user) =>
  ajax('POST' ,'/manage/user/add', user)

const updateUserRequest = (user) =>
  ajax('POST', '/manage/user/update', user)

const deleteUserRequest = (userId) =>
  ajax('POST', '/manage/user/delete', { userId })

export {
  loginRequest,
  weatherRequest,
  addCategoryRequest,
  getCategoriesRequest,
  updateCategoryRequest,
  getProductListRequest,
  searchProductRequest,
  deleteImageRequest,
  addProductRequest,
  getCategoryRequest,
  updateProductRequest,
  updateProductStatusRequest,
  getRolesRequest,
  addRoleRequest,
  updateRoleRequest,
  deleteRoleRequest,
  getUsersRequest,
  addUserRequest,
  updateUserRequest,
  deleteUserRequest,
  cancel

}


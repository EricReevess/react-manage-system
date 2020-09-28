import React from 'react'
import ReactDOM from 'react-dom'
import './assets/index.less'
import App from './App'
import localStorageUtil from './utils/localStorageUtil'
import tempMemoryUtils from './utils/tempMemoryUtil'

const userInfo = localStorageUtil.getData('userInfo')
tempMemoryUtils.userInfo = userInfo

ReactDOM.render(<App/>, document.getElementById('root'))

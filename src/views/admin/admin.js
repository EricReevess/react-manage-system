import React from 'react'
import tempMemoryUtil from '../../utils/tempMemoryUtil'
import { Redirect, useHistory } from 'react-router-dom'
import SiderNav from '../../components/sider-menu'
import localStorageUtil from '../../utils/localStorageUtil'
import { Layout, message } from 'antd'
import ContentHeader from '../../components/content-header'
import ContentBody from '../../components/content-body'
import ContentFooter from '../../components/content-footer'
import './admin.less'

const Admin = () => {
  let history = useHistory()
  const { userInfo } = tempMemoryUtil


  const logout = () => {
    localStorageUtil.removeData('userInfo')
    tempMemoryUtil.userInfo = {}
    message.warn('您已经退出登录了')
    history.replace('/login')
  }



  if (!userInfo || !userInfo._id) {
    return <Redirect to="/login"/>
  }

  return (<Layout className="main-layout">
    <SiderNav />
    <Layout className="main-content">
      <ContentHeader logout={logout}/>
      <ContentBody />
      <ContentFooter/>
    </Layout>
  </Layout>)

}

export default Admin

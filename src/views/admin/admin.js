import React, { useState } from 'react'
import tempMemoryUtil from '../../utils/tempMemoryUtil'
import localStorageUtil from '../../utils/localStorageUtil'
import { Redirect, useHistory } from 'react-router-dom'
import { Breadcrumb, Button, Layout, Menu, message } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import './admin.less'

const { Header, Sider, Content,Footer } = Layout
const { SubMenu } = Menu;

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false)

  let history = useHistory()

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  };
  const logout = () => {
    localStorageUtil.removeData('userInfo')
    tempMemoryUtil.userInfo = {}
    message.warn('您已经退出登录了')
    history.replace('/login')
  }

  const { userInfo } = tempMemoryUtil

  if (!userInfo || !userInfo._id) {
    return <Redirect to="login"/>
  } else {
    return (<Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}  >
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Button type="primary" onClick={logout}>logout</Button>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>)
  }

}

export default Admin

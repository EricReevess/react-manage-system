import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu,Layout } from 'antd'
import * as Icon from '@ant-design/icons'
// import PropTypes from 'prop-types'
import './index.less'
import { Link } from 'react-router-dom'
import menuList from '../../config/menu-config'

const { SubMenu, Item } = Menu
const { Sider } = Layout

const SiderMenu = () => {
  let location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

  const getMenuItems = (menuList) => {
    return menuList.map(item => {
      if (item.hasOwnProperty('children') && item.children.length) {
        return (
          <SubMenu key={item.path} icon={React.createElement(Icon[item.icon])} title={item.title}>
            {getMenuItems(item.children)}
          </SubMenu>
        )
      } else {
        return (
          <Item icon={React.createElement(Icon[item.icon])} key={item.path}>
            <Link to={item.path}>
              {item.title}
            </Link>
          </Item>
        )
      }

    })
  }

  const defaultOpenKey = location.pathname.match(/\/\w+/) ? location.pathname.match(/\/\w+/)[0] : '/home'
  const selectedKey = location.pathname

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo">
        {collapsed ? React.createElement(Icon['FundOutlined'])  : 'Dashboard'}
      </div>
      <Menu
        theme="dark"
        selectedKeys={[selectedKey]}
        focusable
        defaultOpenKeys={[defaultOpenKey]}
        mode="inline">
        {getMenuItems(menuList)}
      </Menu>
    </Sider>)
}


export default SiderMenu
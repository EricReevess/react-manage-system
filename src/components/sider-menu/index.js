import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu,Layout } from 'antd'
import * as Icon from '@ant-design/icons'
import './index.less'
import { Link } from 'react-router-dom'
import menuList from '../../config/menu-config'
import tempMemoryUtil from '../../utils/tempMemoryUtil'

const { SubMenu, Item } = Menu
const { Sider } = Layout

const SiderMenu = () => {
  let location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  }

/*  const getMenuItems = () => {
    const permittedMenus =  tempMemoryUtil.userInfo.role.menus
    return menuList.map(item => {
      if (permittedMenus.indexOf(item.path) !== -1){
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
      } else {
        return null
      }
    })
  }*/

  const hasAuth = (item) => {
    const {path,isPublic} = item
    const menus = tempMemoryUtil.userInfo.role.menus

    if (isPublic || menus.indexOf(path) !== -1){
      return true
    } else if (item.children) {
      return !!item.children.find(item => menus.indexOf(item.path) !== -1)
    }
    return false
  }

  const getMenus = (menuList) => {
    return menuList.reduce((pre, item) => {

      if (hasAuth(item)){
        if (!item.children) {
          pre.push((
            <Item icon={React.createElement(Icon[item.icon])} key={item.path}>
              <Link to={item.path}>
                {item.title}
              </Link>
            </Item>
          ))
        } else {
          pre.push((
            <SubMenu key={item.path} icon={React.createElement(Icon[item.icon])} title={item.title}>
              {getMenus(item.children)}
            </SubMenu>
          ))
        }

      }
      return pre

    },[])
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
        {getMenus(menuList)}
      </Menu>
    </Sider>)
}


export default SiderMenu

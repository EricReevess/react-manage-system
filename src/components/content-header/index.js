import React, { useCallback, useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
import { Button, Layout, Modal } from 'antd'
import formattedDateUtil from '../../utils/formattedDateUtil'
import { cancel, weatherRequest } from '../../api'
// import menuConfig from '../../config/menu-config'
import './index.less'
import { LoadingOutlined }from '@ant-design/icons'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'
const { Header } = Layout


const ContentHeader = ({ logout,navTitle,userInfo }) => {
  // const location = useLocation()
  const [localDate] = useState(formattedDateUtil(new Date()))
  const [weatherInfo, setWeatherInfo] = useState({})
  const [visible, setVisible] = useState(false)
  const getWeatherInfo = async (location) => {
    return await weatherRequest(location)
  }

  /*const getNavTitle = () => {
    const { pathname } = location
    let navTitle = ''
    menuConfig.forEach(item => {
      let temp = item.title
      if (item.path === pathname ){
        navTitle = temp
      } else if (item['children']){
        item['children'].forEach(item => {
          if (item.path === pathname){
            navTitle = temp + ' / ' + item.title
          }
        })
      }
    })
    return navTitle
  }*/
  const confirmLogout = () => {
    setVisible(true)
  }
  const handleOk = () => {
    logout()
    setVisible(false)
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const initWeatherInfo = useCallback(()=> {
    getWeatherInfo('成都').then(value => {
      setWeatherInfo(value)
    })
  },[])

  useEffect(() => {
    initWeatherInfo()
    if (cancel){
      console.log('cancel')
      cancel()
    }
  }, [initWeatherInfo])
  return (<div>
    <Header
      className="content-header">
      <div className="content-header-left">
        <span className="nav-text">{navTitle}</span>
      </div>
      <div className="content-header-right">
        <span className="header-text" id="header-weather">
          <span>{localDate}</span>
          <span>{weatherInfo.date}</span>
          {weatherInfo.dayPictureUrl? <img src={weatherInfo.dayPictureUrl} alt="weather"/> : <LoadingOutlined /> }
          <span>{weatherInfo.weather}</span>
        </span>
        <span className="header-text">欢迎, { userInfo.username || undefined}</span>
        <Button type="primary" onClick={confirmLogout}>登出</Button>
        <Modal
          title="登出"
          okText="确定"
          cancelText="取消"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>确定要退出登录吗？</p>
        </Modal>
      </div>
    </Header>
  </div>)

}

export default connect(
  state => ({navTitle:state.navTitle,userInfo:state.userInfo}),
  {logout}
)(ContentHeader)


import React from 'react'
import './login.less'
import 'font-awesome/css/font-awesome.css'
import { Redirect, useHistory } from 'react-router-dom'
import { Form, Input, Button, message, Checkbox } from 'antd'
import {
  UserOutlined, LockOutlined
} from '@ant-design/icons'
import { loginRequest } from '../../api'
import localStorageUtil from '../../utils/localStorageUtil'
import tempMemoryUtil from '../../utils/tempMemoryUtil'

const Login = () => {

  let history = useHistory()
  const { userInfo } = tempMemoryUtil

  const handleSubmit = async loginInfo => {
    const { username, password } = loginInfo
    const { data: responseData } = await loginRequest({ username, password })
    if (responseData.status === 1) {
      message.warning('账号或者密码错误！')
    }
    if (responseData.status === 0) {
      message.success('登陆成功！')
      localStorageUtil.saveData('userInfo', responseData.data)
      tempMemoryUtil.userInfo = responseData.data
      console.log(tempMemoryUtil.userInfo)
      history.replace('/')
    }

  }
  if (userInfo && userInfo._id) {
    return <Redirect to="/"/>
  } else {
    return (<div className="login">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <h1>登陆后台管理系统</h1>
        <Form.Item
          name="username"
          rules={[{
            required: true, message: '请输入用户名'
          }, {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/, message: '用户名必须为英文字母开头，长度为6-10位!'
          }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon"/>}
            placeholder="用户名"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{
            required: true, message: '请输入密码!'
          }]}
        >
          <Input
            size="large"
            prefix={<LockOutlined className="site-form-item-icon"/>}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button">
            <strong>登陆</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>)
  }


}
export default Login

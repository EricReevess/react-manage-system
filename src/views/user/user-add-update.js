import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Drawer, Form, Button, Col, Row, Input, message, Select } from 'antd'
import PropTypes from 'prop-types'
import { addUserRequest, updateUserRequest } from '../../api'
import { EyeInvisibleOutlined,EyeTwoTone } from '@ant-design/icons'
const { Option } = Select

let UserAddUpdate = (props) => {
  const { userRef } = props
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(undefined)
  const [role_id, setRole_id] = useState(undefined)
  const [submitType, setSubmitType] = useState('add')

  useImperativeHandle(userRef, () => ({
    setUserInfo, setSubmitType
  }))
  // 更新User
  const setUserInfo = (render) => {
    const { _id, username, email, phone, role_id } = render
    setUserId(_id)
    setUsername(username)
    setEmail(email)
    setPhone(phone)
    setRole_id(role_id)
  }

  // 提交信息
  const handleSubmit = async values => {
    const { username,password, email, phone, role_id } = values
    props.setConfirmLoading(true)
    if (submitType === 'add') {
      const newUserInfo = {
        username,password, email, phone, role_id
      }
      const {data:result} = await addUserRequest(newUserInfo)
      if (result.status === 0) {
        message.success('添加用户成功')
        props.onClose()
        props.getUserList()
      } else {
        message.error('添加用户失败，请重试')
      }
    } else {
      const editedUserInfo = {
        _id:userId, username, email, phone, role_id
      }
      const {data:result} = await updateUserRequest(editedUserInfo)
      if (result.status === 0) {
        message.success('用户信息修改成功')
        props.onClose()
        props.getUserList()
      } else {
        message.error('用户信息修改失败，请重试')
      }
    }
    props.setConfirmLoading(false)
  }


  return (<Drawer
    title={submitType === 'add' ? '新增用户' : '修改用户'}
    width={720}
    destroyOnClose
    maskClosable={false}
    onClose={props.onClose}
    visible={props.drawerVisible}
    bodyStyle={{ paddingBottom: 80 }}
  >
    <Form layout="vertical"
          name="add-update-user"
          onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="username"
            label="用户名"
            initialValue={username}
            rules={[{ required: true, message: '需要输入用户名' }]}
          >
            <Input
              value={username}
              onChange={(event => {
                setUsername(event.target.value)
              })}
              placeholder="请输入用户名"
            />
          </Form.Item>
        </Col>
        { submitType === 'add' ? <Col span={12}>
          <Form.Item
            name="password"
            label="密码"
            initialValue={password}
            rules={[{ required: true, message: '需要输入密码' }]}
          >
            <Input.Password
              value={password}
              onChange={(event => {
                setPassword(event.target.value)
              })}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              placeholder="请输入密码"
            />
          </Form.Item>
        </Col> : null}
        <Col span={12}>
          <Form.Item
            name="email"
            label="邮箱"
            initialValue={email}
            rules={[{ required: true, message: '需要输入邮箱' }]}
          >
            <Input
              value={email}
              onChange={(event => {
                setEmail(event.target.value)
              })}
              placeholder="请输入邮箱"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="电话"
            initialValue={phone}
            rules={[{
              required: true, message: '需要输入电话号码'
            }, {
              pattern: /^\d{11}$/, message: '请输入正确的电话号码'
            }]}
          >
            <Input
              placeholder="请输入电话号码"
              value={phone}
              onChange={e => {
                setPhone(Number(e.target.value))
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="role_id"
            label="所属角色"
            initialValue={role_id}
            rules={[{ required: true, message: '需要选择角色' }]}
          >
            <Select
              placeholder="请选择角色"
              value={role_id}
              onChange={(value) => {setRole_id(value)}}
            >
              {
                props.roleList.map(item => (
                  <Option key={item._id} value={item._id}>{item.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button loading={props.confirmLoading} htmlType="submit" style={{ marginRight: 8 }} type="primary">
              提交
            </Button>

            <Button onClick={props.onClose}>
              取消
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Drawer>)

}
UserAddUpdate.propTypes = {
  onClose: PropTypes.func.isRequired,
  drawerVisible: PropTypes.bool.isRequired,
  confirmLoading: PropTypes.bool.isRequired,
  setConfirmLoading: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
  roleList:PropTypes.array.isRequired

}


const UserAddUpdateRef = forwardRef((props, ref) => (<UserAddUpdate {...props} userRef={ref}/>))

export default UserAddUpdateRef

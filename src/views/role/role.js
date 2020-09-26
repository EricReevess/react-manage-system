import React, { useCallback, useEffect, useState } from 'react'
import { Card, Button, Table, Modal, Input, Space, message,Tree } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { addRoleRequest, getRolesRequest, updateRoleRequest } from '../../api'
import menuConfig from '../../config/menu-config'
import localStorageUtil from '../../utils/localStorageUtil'

const Role = () => {
  const [roleList, setRoleList] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [addRoleVisible, setAddRoleVisible] = useState(false)
  const [addRoleValue, setAddRoleValue] = useState('')
  const [addRoleLoading, setAddRoleLoading] = useState(false)
  const [updateRoleVisible, setUpdateRoleVisible] = useState(false)
  const [updateRoleLoading, setUpdateRoleLoading] = useState(false)
  const [currentRole, setCurrentRole] = useState('')
  // 列头信息
  const columns = [{
    title: '角色名称', dataIndex: 'name', key: 'name',
  }, {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text) => (text ? new Date(text).toLocaleString('zh-TW') : '')
  }, {
    title: '授权时间',
    dataIndex: 'auth_time',
    key: 'auth_time',
    render: (text) => (text ? new Date(text).toLocaleString() : '')
  }, {
    title: '授权人', dataIndex: 'auth_name', key: 'auth_name'
  }, {
    title: '操作', key: 'action', render: (text, render) => (<Space size="middle">
      <Button onClick={() => {
        setUpdateRoleVisible(true)
        setCurrentRole(render)
      }}>更改权限</Button>
    </Space>), width: 100
  }]
  const title = (<div>
      <Button
        type="primary"
        style={{ marginRight: '10px' }}
        onClick={() => {
          setAddRoleVisible(true)
        }}>
        <PlusOutlined/>
        创建角色
      </Button>
    </div>)

  const onCheck = (checkedKeys) => {
    setCurrentRole(prevState => ({
      ...prevState,
      menus:checkedKeys
    }))

  }

  const getRoleList = async () => {
    setTableLoading(true)
    const { data: result } = await getRolesRequest()
    if (result.status === 0) {
      setRoleList(result.data)
    } else {
      message.error('获取角色数据失败')
    }
    setTableLoading(false)
  }

  const handleAddRole = async () => {
    setAddRoleLoading(true)
    const roleName = addRoleValue.trim()
    if(!!roleName){
      const { data: result } = await addRoleRequest(addRoleValue.trim())
      if (result.status === 0) {
        getRoleList()
        message.success('角色添加成功')
      } else {
        message.error('角色添加失败')
      }
      setAddRoleLoading(false)
      setAddRoleVisible(false)
      setAddRoleValue('')
    } else {
      message.warn('输入不能为空')
    }
  }

  const handleUpdateRole = async () => {
    setUpdateRoleLoading(true)
    const auth_name = localStorageUtil.getData('userInfo').username
    const { data: result } = await updateRoleRequest({ ...currentRole,auth_name })
    if (result.status === 0) {
      getRoleList()
      message.success('更新角色权限成功')
    } else {
      message.error('更新角色权限失败，请重试')
    }
    setUpdateRoleLoading(false)
    setUpdateRoleVisible(false)
  }
  const handleAddCancel = () => {
    setAddRoleVisible(false)
    setAddRoleValue('')
  }
  const handleUpdateCancel = () => {
    setUpdateRoleVisible(false)
  }

  const formatDate = (ms) => {
    const date = new Date(ms)
    return [date.getFullYear(),date.getMonth()+1,date.getDay()].join('-') + ' ' +
      [date.getHours(),date.getMinutes(),date.getSeconds()].join(':')
  }

  const initRoleList = useCallback(getRoleList, [])

  useEffect(() => {
    initRoleList()
  }, [initRoleList])


  return (<Card title={title}
  >
    <Table
      loading={tableLoading}
      bordered
      rowKey="_id"
      dataSource={roleList}
      columns={columns}
      pagination={{ position: ['bottomCenter'], defaultPageSize: 10, showQuickJumper: true }}
    />
    <Modal
      title="创建角色"
      visible={addRoleVisible}
      confirmLoading={addRoleLoading}
      okText="提交"
      cancelText="取消"
      onOk={handleAddRole}
      onCancel={handleAddCancel}
    >
      <Input
        required
        value={addRoleValue}
        onChange={(e) => setAddRoleValue(e.target.value)}
        addonBefore={<span>角色名：</span>}
        placeholder="请输入角色"
      />
    </Modal>
    <Modal
      title={`更改角色 ${currentRole.name} 的权限`}
      visible={updateRoleVisible}
      confirmLoading={updateRoleLoading}
      okText="提交"
      cancelText="取消"
      onOk={handleUpdateRole}
      onCancel={handleUpdateCancel}
    >
      <Tree
        checkable
        selectable={false}
        defaultExpandedKeys={['/products','/charts']}
        checkedKeys={currentRole.menus}
        onCheck={onCheck}
        treeData={menuConfig}
      />
    </Modal>
  </Card>)

}


export default Role

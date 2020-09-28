import React, { useState, useEffect, useCallback } from 'react'
import { Button, Card, Input, Modal, Space, Table, message, Breadcrumb } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  addCategoryRequest, cancel, getCategoriesRequest, updateCategoryRequest
} from '../../api'
const {Item} = Breadcrumb

const Category = () => {
  // state
  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [parentId, setParentId] = useState(0)
  const [modalTitle, setModalTitle] = useState('')
  const [modalInputVal, setModalInputVal] = useState('')
  const [modalOperationType, setModalOperationType] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [subCategoryList, setSubCategoryList] = useState([])
  const [parentName, setParentName] = useState('主分类列表')
  const [editCategoryInfo, setEditCategoryInfo] = useState({})
  const [categoryTitleInfo, setCategoryTitleInfo] = useState([{name:'主分类列表',_id:0}])

  const categoryTitle =
    <Breadcrumb>
      {
        categoryTitleInfo.map((category,index) => (
          <Item href="#"
                onClick={() => {handleBreadcrumbClick(category._id,category.name,index)}}
                key={category._id}>
            {category.name}
          </Item>
        ))
      }
    </Breadcrumb>

  // 列头信息
  const columns = [{
    title: '分类名称', dataIndex: 'name', key: 'name',
  }, {
    title: '操作', key: 'action', render: (text, render) => (<Space size="middle">
      {/*若要传递参数，不能直接在onClick内直接传入回调函数，需要使用另一个函数包裹*/}
      <Button onClick={() => {showSubCategoryList(render)}}>查看详情</Button>
      <Button onClick={() => {showModal('update',render)}}>修改名称</Button>
    </Space>), width: 300
  }]

  const showModal = (operationType,render) => {
    setVisible(true)
    setModalOperationType(operationType)
    if (operationType === 'add'){
      setModalTitle( <span>在 <strong>{parentName}</strong> 中新增类别</span>)
      setModalInputVal('')
    }
    if (operationType === 'update'){
      setModalTitle(<span>更新类别名</span>)
      setModalInputVal(render.name)
      setEditCategoryInfo(render)
    }
  }

  const handleOk = () => {
    if (modalInputVal.trim() === ''){
      message.warn('类别名不能为空')
      return
    }
    if (modalOperationType === 'add'){
      if (categoryList.find(item => item.name === modalInputVal)){
        message.warn('添加的类别已存在')
        return
      }
      addCategory({
        parentId,
        categoryName:modalInputVal
      })
    }
    if (modalOperationType === 'update'){
      if (editCategoryInfo.name === modalInputVal){
        message.warn('您未作出任何修改')
        return
      }
      updateCategory({
        categoryId:editCategoryInfo._id,
        categoryName:modalInputVal
      })
    }
    setVisible(false)
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const showSubCategoryList = (render) => {
    setCategoryTitleInfo(prevState => ([
      ...prevState,
      render
    ]))
    setParentId(render._id)
    setParentName(render.name)
  }

  // 处理面包导航
  const handleBreadcrumbClick = (id,name,index) => {
    if (index === categoryTitleInfo.length -1 ){
      return
    }
    setParentId(id)
    setParentName(name)
    setCategoryTitleInfo(prevState => prevState.slice(0,index + 1))
  }

  const getCategoryList = async () => {
    setSubCategoryList([])
    setIsLoading(true)
    const {data:result} = await getCategoriesRequest(parentId)
    if (result.status === 0) {
      if (parentId === 0) {
        setCategoryList(result.data)
      } else{
        setSubCategoryList(result.data)
      }
    } else {
      message.error('获取分类数据列表失败')
    }
    setIsLoading(false)
  }

  const addCategory = async (newCategoryInfo) => {
    const { data } = await addCategoryRequest(newCategoryInfo)
    if (data.status === 0){
      getCategoryList();
      message.success('添加成功')
    } else {
      message.error('添加失败')
    }
  }

  const updateCategory = async (updateCategoryInfo) => {
    const { data } = await updateCategoryRequest(updateCategoryInfo)
    if (data.status === 0){
      getCategoryList();
      message.success('修改成功')

    } else {
      message.error('更新失败')
    }
  }

  const initCategoryList = useCallback(getCategoryList,[parentId])

  // 生命周期
  useEffect(() => {
    initCategoryList()
    return () => {
      if (cancel){
        cancel()
      }
    }
  }, [initCategoryList])

  return (
    <Card title={categoryTitle}
          extra={
            <Button onClick={() => {showModal('add')}}>
              <PlusOutlined/>
              新增类别
            </Button>
          }
    >
    <Table
      bordered
      rowKey="_id"
      dataSource={!parentId ? categoryList : subCategoryList}
      columns={columns}
      loading={isLoading}
      pagination={{ position: ['bottomCenter'], defaultPageSize: 10, showQuickJumper: true }}
    />
    <Modal
      title={modalTitle}
      visible={visible}
      okText="提交"
      cancelText="取消"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Input value={modalInputVal}
             onChange={(e) => setModalInputVal(e.target.value)}
             addonBefore={<span>类别名：</span>}
             placeholder="请输入类别名"
      />

    </Modal>
  </Card>)

}

export default Category

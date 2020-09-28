import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, Input, Select, Space, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  cancel, getCategoriesRequest,
  getCategoryRequest,
  getProductListRequest,
  searchProductRequest,
  updateProductStatusRequest
} from '../../api'
import ProductAddUpdate from './product-add-update'
import ProductDetail from './product-detail'

const {Option} = Select
const { Search } = Input


const ProductList = () => {

  const updateRef = useRef(null)

  // state
  const [isLoading, setIsLoading] = useState(true)
  const [addDrawerVisible, setAddDrawerVisible] = useState(false)
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [productList, setProductList] = useState([])
  const [productDetailInfo, setProductDetailInfo] = useState({})
  const [total, setTotal] = useState(0)
  const [searchType, setSearchType] = useState('productName')
  const [confirmLoading, setConfirmLoading,] = useState(false)
  const [categories, setCategories,] = useState([])
  const [currentPageNum, setCurrentPageNum,] = useState(1)

  const getProductInfo = async (render) => {
    const {name,desc,price,imgs,detail,categoryId,pCategoryId} = render
    let categoryName
    let pCategoryName

    const categories = await Promise.all([
      getCategoryRequest(pCategoryId),
      getCategoryRequest(categoryId),
      ])
    const [pCategory,category ] = categories
    if (category.data.status === 0){
      categoryName = category.data.data.name
    } else {
      categoryName = undefined
    }
    if (pCategory.data.status === 0){
      pCategoryName = pCategory.data.data.name
    } else {
      pCategoryName = undefined
    }
    setDetailDrawerVisible(true)
    setProductDetailInfo({
      name,
      desc,
      price,
      categoryName,
      pCategoryName,
      imgs,
      detail
    })
  }

  const updateProductInfo = (render) => {
    setAddDrawerVisible(true)
    updateRef.current.setProductInfo(render)
    updateRef.current.setSubmitType('update')

  }


  const getProductList =  (pageNum = 1) => {
    setCurrentPageNum(prevState => prevState !== pageNum ? pageNum : prevState)
    setIsLoading(true)
    getProductListRequest(pageNum, 5).then(value => {
      const { data:result } = value
      if (result.status === 0){
        const {total, list} = result.data
        setTotal(total)
        setProductList(list)
      }
      setIsLoading(false)
    })

  }

  // 抽屉开启回调
  const addNewProduct = () => {
    setAddDrawerVisible(true)
    updateRef.current.setProductInfo({})
    updateRef.current.setSubmitType('add')
  }

  // 抽屉关闭回调
  const addDrawerClose = () => {
    setAddDrawerVisible(false)
    setConfirmLoading(false)
  }

  const detailDrawerClose = () => {
    setDetailDrawerVisible(false)
  }
  // -------懒加载分类数据-----------
  const getCategories = async (parentId=0) => {
    const { data:result } = await getCategoriesRequest(parentId)
    if (result.status === 0){
      const categories = result.data
      if (parentId === 0){
        handleOptions(categories)
      } else {
        return categories
      }
    }
  }

  const handleOptions = categories => {
    const options = categories.map(category => ({
      value: category._id,
      label: category.name,
      isLeaf: false
    }))
    options.forEach( async category => {
      const subCategories = await getCategories(category.value)

      if (subCategories && subCategories.length > 0){
        category.children = subCategories.map(category => ({
          value: category._id, label: category.name, isLeaf: true
        }))
      } else {
        category.isLeaf = true
      }
    })
    setCategories(options)
  }

/*  const loadCategoryData = async selectedOptions => {
    console.log('loading')
    const targetOption = selectedOptions[0];
    targetOption.loading = true


    const subCategories = await getCategories(targetOption.value)

    if (subCategories && subCategories.length > 0){
      const childOption =  subCategories.map(category => ({
        value: category._id,
        label: category.name,
        isLeaf: true
      }))
      targetOption.children = childOption
    } else {
      targetOption.isLeaf = true
    }
    // load categories lazily
    targetOption.loading = false
    setCategories([...categories])

  }*/
  // ------------------

  // 搜索商品
  const handleSearchProduct = async (keyword) => {
    setIsLoading(true)
    const { data:result } = await searchProductRequest(1,5,keyword.trim(),searchType )
    if (result.status === 0){
      const {total, list} = result.data
      setTotal(total)
      setProductList(list)
      setCurrentPageNum(1)
    }
    setIsLoading(false)
  }

  // 更新商品上下架状态
  const changeProductState =  (render) => {
    const {_id:productId, status} = render
    updateProductStatusRequest(productId, !status).then(({ data }) => {
      if (data.status === 0){
        message.success(`商品${status ? '下架' : '上架'}成功`)
        getProductList(currentPageNum)
      }else{
        message.error(data.msg)
      }
    })
  }

  // 列头信息
  const columns = [{
    title: '商品名称', dataIndex: 'name', key: 'name',width: 180
  }, {
    title: '商品描述', dataIndex: 'desc', key: 'desc'
  }, {
    title: '价格', dataIndex: 'price', key: 'price',width: 100, render: price => '￥ '+ price
  },{
    title: '状态', dataIndex: 'status', key: 'status',width: 75, render:(text, render) => (
      render.status ? '已上架' : '已下架'
    )
  }, {
    title: '操作', key: 'action', width: 200, render: (text, render) => (<Space size="middle">
      {/*若要传递参数，不能直接在onClick内直接传入回调函数，需要使用另一个函数包裹*/}
      <Button onClick={() => {
        getProductInfo(render)
      }}>查看详情</Button>
      <Button onClick={() => {
        updateProductInfo(render)
      }}>修改</Button>
      <Button onClick={() => {
        changeProductState(render)
      }}>{render.status ? '下架' : '上架'}</Button>
    </Space>)
  }]

  const cardTitle = (
    <div>
      <Select
        value={searchType}
        onChange={(value) => {setSearchType(value)}}
      >
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
      </Select>
      <Search
        placeholder="请输入关键字"
        onSearch={value => { handleSearchProduct(value)} }
        style={{ width: 200 }}
      />
    </div>
  )
  const extra = (
    <Button onClick={addNewProduct}>
      <PlusOutlined/>
      新增商品
    </Button>
  )
  // 初始化分类列表
  const initCategories = useCallback(getCategories,[])
  const initProductList = useCallback(getProductList,[])
  // 生命周期
  useEffect(() => {
    initProductList()
    initCategories()
    return () => {
      if (cancel){
        cancel()
      }
    }
  },[initCategories,initProductList])

  return (<Card title={cardTitle}
                extra={extra}
  >
    <Table
      bordered
      rowKey="_id"
      dataSource={productList}
      columns={columns}
      loading={isLoading}
      pagination={{
        current:currentPageNum,
        total ,
        position: ['bottomCenter'],
        defaultPageSize: 5,
        showQuickJumper: true,
        onChange:getProductList}}
    />
    <ProductAddUpdate
      ref={updateRef}
      drawerVisible={addDrawerVisible}
      onClose={addDrawerClose}
      confirmLoading={confirmLoading}
      getProductList={getProductList}
      currentPageNum={currentPageNum}
      setConfirmLoading={value => setConfirmLoading(value) }
      categories={categories}
/*
      loadCategoryData={loadCategoryData}
*/
    />
    <ProductDetail
      onClose={detailDrawerClose}
        drawerVisible={detailDrawerVisible}
      productDetailInfo={productDetailInfo}
    />
  </Card>)

}

export default ProductList

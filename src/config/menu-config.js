const menuConfig = [
  {
    title:'首页',
    path:'/home',
    icon:'HomeOutlined',
  },
  {
    title:'商品',
    path:'/products',
    icon:'ShopOutlined',
    children:[
      {
        title:'分类管理',
        path:'/products/category',
        icon:'OrderedListOutlined',
      },
      {
        title:'商品管理',
        path:'/products/product',
        icon:'BarcodeOutlined',
      }
    ]
  },
  {
    title:'用户管理',
    path:'/user',
    icon:'TeamOutlined',

  },
  {
    title:'角色管理',
    path:'/role',
    icon:'UserOutlined',
  },
  {
    title:'统计图表',
    path:'/charts',
    icon:'AreaChartOutlined',
    children:[
      {
        title:'柱状图',
        path:'/charts/bar',
        icon:'BarChartOutlined',
      },
      {
        title:'折线图',
        path:'/charts/line',
        icon:'LineChartOutlined',

      },
      {
        title:'饼图',
        path:'/charts/pie',
        icon:'PieChartOutlined',

      }
    ]
  }

]
export default menuConfig

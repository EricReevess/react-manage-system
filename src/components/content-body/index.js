import React from 'react'
import { Layout } from 'antd'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../views/home/home'
import Category from '../../views/category/category'
import User from '../../views/user/user'
import Role from '../../views/role/role'
import Bar from '../../views/charts/bar'
import Line from '../../views/charts/line'
import Pie from '../../views/charts/pie'
import Product from '../../views/product/product'

const { Content } = Layout
const ContentBody = () => {

  return (<Content>
    <div style={{ padding: 24, minHeight: 360 }}>
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/products/category" component={Category}/>
        <Route path="/products/product" component={Product}/>
        <Route path="/user" component={User}/>
        <Route path="/role" component={Role}/>
        <Route path="/charts/bar" component={Bar}/>
        <Route path="/charts/line" component={Line}/>
        <Route path="/charts/pie" component={Pie}/>
        <Redirect to="/home"/>
      </Switch>
    </div>
  </Content>)

}

export default ContentBody

import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProductList from './product-list'
import ProductDetail from './product-detail'

const Product = () => {

  return (
      <Switch>
        <Route exact path="/products/product" component={ProductList}/>
        <Route path="/products/product/detail" component={ProductDetail}/>
        <Redirect to="/products/product"/>
      </Switch>

    )

}

export default Product

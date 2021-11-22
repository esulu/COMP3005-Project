import React, { Fragment } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';

// components
import { Input, List, NavBar, Book, BookStore } from './components';

// pages
// import { Store, Orders, Cart } from './pages';

let data = {"isbn":"9781781100264","title":"Harry Potter and the Deathly Hallows (Harry Potter, #7)","year":2015,"genre":"Fiction","page_count":784,"price":10.99,"commission":0.01,"url":"http://books.google.com/books/content?id=gCtazG4ZXlQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api","quantity":34,"is_purchasable":null,"publisher_id":10000,"publisher_name":"Pottermore Publishing","author_name":"J.K. Rowling"}

function App() {
  return (
    
    <Fragment>
      <BookStore></BookStore>
      {/* <div className="container">
        <Input />
        <List />
      </div> */}
      {/* <NavBar /> */}
      <Switch>
        <Redirect exact from='/' to='/store' />
        <Route exact path="/:page?" render={props => <NavBar {...props} />} />
        {/* <Route path='/store' component={Store} />
        <Route path='/book/:isbn' component={Book} />
        <Route path='/orders' component={Orders} />
        <Route path='/orders/:order_id' component={OrderDetails} />
        <Route path='/cart' component={Cart} />
        <Route path='/checkout' component={Checkout} />
        <Route path='/statistics' component={SalesStatistics} />
        <Route path='/editor' component={StockEditor} /> */}
      </Switch>
    </Fragment>
  );
}

export default App;

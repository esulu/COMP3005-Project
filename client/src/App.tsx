import React, { Fragment } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';

// components
import { Input, List, NavBar, Book, BookStore } from './components';

// pages
// import { Store, Orders, Cart } from './pages';

function App() {
  return (
    
    <Fragment>
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

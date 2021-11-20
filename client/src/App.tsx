import React, { Fragment } from 'react';
import './App.css';

// components
import { Input, List } from './components';

function App() {
  return (
  <Fragment>
    <div className="container">
      <Input />
      <List/>
    </div>
  </Fragment>
  );
}

export default App;

import React, { Fragment, useState } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Stack, Alert } from '@mui/material';

// components
import { NavBar, UseToken } from './components';

// pages
import { Login } from './pages';

function App() {
  const { token, setToken } = UseToken();

  if (!token) { // User is directed to login page if not authenticated
    return <Login setToken={setToken} />
    
  } else if (token === -1) {  // Invalid log in represented by token id -1
    return (
      <Fragment>
        <Login setToken={setToken} />
        <Stack alignItems="center">
          <Alert severity="error">Error - Authentication Failed</Alert>
        </Stack>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Switch>
        <Redirect exact from="/" to="/store" />
        <Route exact path="/:page?" render={props => <NavBar {...props} />} />
      </Switch>
    </Fragment>
  );
}

export default App;

import React, { Fragment } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Stack, Alert } from '@mui/material';
import { NoMatchPage } from './pages';
// components
import { NavBar, UseToken } from './components';

// pages
import { Login } from './pages';

function App() {
  const { token, setToken, isTokenOwner } = UseToken();



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

  // Don't allow the user to go to owner only pages when they are not the owner
  // Probably better ways to do this (ProtectedRoute), but had too many problems doing it
  const userAllowedToGoToNavBar = (props: any): boolean => {
    const { match } = props;
    if ((match.params.page === "statistics" ||
      match.params.page === "modifyBookstore") &&
      !isTokenOwner) {
      return false;
    }
    return true;
  }


  return (
    <Fragment>
      <Switch>
        <Redirect exact from="/" to="/store" />
        <Route exact path="/:page?" render={props => (
          userAllowedToGoToNavBar(props) ?
            <NavBar {...props} />
            : <NoMatchPage />
        )} />
        <Route component={NoMatchPage} />
      </Switch>
    </Fragment>
  );
}

export default App;

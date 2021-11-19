import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Nav from '../Nav';
import FlashMessage from '../FlashMessage';
import Modal from '../Modal';
import NotFound from '../NotFound';

import { APP_ROUTES } from '../../routes';
import { NavLinkUI } from '../Nav/interfaces';

import './App.scss';

export default function App() {
  return (
    <div className="app">
      <Nav routes={APP_ROUTES} />

      <FlashMessage />
      <Modal />

      <div className="app__content content">
        <Switch>
          {APP_ROUTES.map((route: NavLinkUI) => (
            <Route
              key={route.label}
              path={route.path}
              // eslint-disable-next-line react/jsx-props-no-spreading
              component={() => <route.component {...route.props} />}
              exact
            />
          ))}

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

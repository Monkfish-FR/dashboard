import React from 'react';
import { NavLink } from 'react-router-dom';

import { NavLinkUI, NavLinksListUI } from './interfaces';

import './Nav.scss';

export default function Nav({ routes }: NavLinksListUI) {
  return (
    <nav className="app__nav nav">
      <div>
        <NavLink
          className="nav__logo"
          to="/"
          exact
        >
          <h1>Monkfish</h1>
        </NavLink>
      </div>

      <ul>
        {routes.map((route: NavLinkUI) => (
          <li key={route.label}>
            <NavLink
              className="nav__link"
              activeClassName="nav__link--active"
              to={route.path}
              exact
            >
              {route.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

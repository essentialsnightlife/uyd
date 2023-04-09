import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import LoginMagicLink from './LoginMagicLink';

export const router = createBrowserRouter([
  {
    path: 'hw',
    element: <p>Hello world!</p>,
  },
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginMagicLink />,
  },
]);

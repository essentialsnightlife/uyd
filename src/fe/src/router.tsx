import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from './Home';
import LoginMagicLink from './LoginMagicLink';
import ViewUsersAnalysedDreams from './ViewUsersAnalysedDreams';

export const router = createBrowserRouter([
  {
    path: 'hw',
    element: <p>Hello world!</p>,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <LoginMagicLink />,
  },
  {
    path: '/your-dreams',
    element: <ViewUsersAnalysedDreams />,
  },
]);

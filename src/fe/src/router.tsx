import * as React from 'react';
import App from './App';
import {
    createBrowserRouter
} from "react-router-dom"

export const router = createBrowserRouter([
    {
        path: "hw",
        element: <p>Hello world!</p>,
    },    {
        path: "/",
        element: <App />,
    }
])

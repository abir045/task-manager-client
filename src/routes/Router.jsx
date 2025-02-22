import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import AddTask from "../pages/AddTask";
import ViewTasks from "../pages/ViewTasks";
import PrivateRoute from "../Providers/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/addTask",
        element: (
          <PrivateRoute>
            <AddTask />
          </PrivateRoute>
        ),
      },
      {
        path: "/viewTasks",
        element: (
          <PrivateRoute>
            <ViewTasks />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;

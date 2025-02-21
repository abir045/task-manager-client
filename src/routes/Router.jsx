import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import AddTask from "../pages/AddTask";
import ViewTasks from "../pages/ViewTasks";

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
        element: <AddTask />,
      },
      {
        path: "/viewTasks",
        element: <ViewTasks />,
      },
    ],
  },
]);

export default router;

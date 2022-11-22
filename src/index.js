import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import { App } from "./App";
import { DataFabric } from "./DataFabric";
import { MLOps } from "./MLOps";
import { Home } from "./Home";
import { DataFabricCard } from "./lib/DataFabricCard";
import { Story } from "./lib/Story";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/datafabric",
        children: [
          { index: true, element: <DataFabric /> },
          { path: "/datafabric/:address", element: <DataFabricCard /> },
          { path: "/datafabric/:address/:story", element: <Story /> },
        ],
      },
      {
        path: "/mlops",
        element: <MLOps />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import { App } from "./App";
import { DataFabric } from "./DataFabric";
import { MLOps } from "./MLOps";
import { Home } from "./Home";
import { DataFabricCard } from "./lib/DataFabricCard";

const router = createBrowserRouter([
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

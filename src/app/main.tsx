import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import UserPreferenceProvider from "./UserPreferenceProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserPreferenceProvider />
    <RouterProvider router={router} />
  </React.StrictMode>
);

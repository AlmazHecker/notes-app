import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import UserPreferenceProvider from "./UserPreferenceProvider";
import "@/shared/locale/i18next";
import Layout from "@/widgets/Layout";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <UserPreferenceProvider />
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>
);

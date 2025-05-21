import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import UserPreferenceProvider from "./UserPreferenceProvider";
import "@/shared/locale/i18next";
import Layout from "@/widgets/Layout";


import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
    onNeedRefresh() {
        // Show update prompt
        if (confirm('New content available. Reload?')) {
            updateSW(true)
        }
    },
    onOfflineReady() {
        console.log('App is ready for offline use')
    },
})

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <UserPreferenceProvider />
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>
);

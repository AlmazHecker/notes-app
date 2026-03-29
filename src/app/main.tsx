import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import UserPreferenceProvider from "./user-prefernce-provider";
import "@/shared/locale/i18next";
// import Layout from "@/widgets/Layout";
import { useEntryStore } from "@/entities/entry/api";
const root = ReactDOM.createRoot(document.getElementById("root")!);

const bootstrapApp = async () => {
  await navigator.storage.persist();

  const hash = location.hash.replace(/^#/, ""); // it turns out the hash routing has it's own property on location
  const url = new URL(hash, "http://dummy");
  const folderPath = url.pathname.split("/").filter(Boolean);

  await useEntryStore.getState().setPath(folderPath);
};

bootstrapApp().then(() =>
  root.render(
    <React.StrictMode>
      <UserPreferenceProvider />
      {/* <Layout> */}
      <RouterProvider router={router} />
      {/* </Layout> */}
    </React.StrictMode>,
  ),
);

if ("serviceWorker" in navigator && !import.meta.env.DEV) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}

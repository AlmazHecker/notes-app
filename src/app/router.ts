const ExportNotes = lazy(() => import("@/pages/ExportNotes"));
const Index = lazy(() => import("@/pages/Index"));
const Settings = lazy(() => import("@/pages/Settings"));
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Index,
    },
    {
      path: "/settings",
      Component: Settings,
    },
    {
      path: "/export",
      Component: ExportNotes,
    },
  ],
  { basename: import.meta.env.PROD ? "/notes-app" : "/" }
);

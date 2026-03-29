import { lazy } from "react";
// const ExportNotes = lazy(() => import("@/pages/ExportNotes"));
const Index = lazy(() => import("@/pages"));
const Settings = lazy(() => import("@/pages/settings"));
import { createHashRouter } from "react-router-dom";

export const router = createHashRouter(
  [
    {
      path: "/*",
      Component: Index,
    },
    {
      path: "/settings",
      Component: Settings,
    },
  ],
  // { basename: import.meta.env.BASE_URL },
);

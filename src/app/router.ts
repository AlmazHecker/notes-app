import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
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
  ],
  { basename: import.meta.env.PROD && "/notes-app" }
);

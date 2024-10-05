import MainLayout from "@/layout/MainLayout";
import React from "react";

const home = React.lazy(() => import("@/pages/Home"));
const notFound = React.lazy(() => import("@/pages/NotFound"));
const csv = React.lazy(() => import("@/pages/CSV"));

const routes = [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: home,
      },
      {
        path: "/csv",
        Component: csv,
      },
      {
        path: "/404",
        Component: notFound,
      },
      {
        path: "*",
        Component: notFound,
      },
    ],
  },
];

export default routes;

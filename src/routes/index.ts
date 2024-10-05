import MainLayout from "@/layout/MainLayout";
import React from "react";

const home = React.lazy(() => import("@/pages/Home"));
const notFound = React.lazy(() => import("@/pages/NotFound"));

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

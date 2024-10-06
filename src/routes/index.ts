import MainLayout from "@/layout/MainLayout";
import React from "react";

const home = React.lazy(() => import("@/pages/Home"));
const notFound = React.lazy(() => import("@/pages/NotFound"));
const csv = React.lazy(() => import("@/pages/CSV"));
const csvDetails = React.lazy(() => import("@/pages/CSVDetails"));
const images = React.lazy(() => import("@/pages/Images"));
const imageDetails = React.lazy(() => import("@/pages/ImageDetails"));
const text = React.lazy(() => import("@/pages/Text"));

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
        path: "/csv/:id",
        Component: csvDetails,
      },
      {
        path: "/images",
        Component: images,
      },
      {
        path: "/images/:id",
        Component: imageDetails,
      },
      {
        path: "/text",
        Component: text,
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

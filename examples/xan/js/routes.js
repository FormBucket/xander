import { loadable } from "hrx";

let loader = loader =>
  loadable({
    loader
  });

let routes = [
  {
    path: "/",
    component: loader(() => import("./HomePage"))
  },
  {
    path: "*",
    component: loader(() => import("./PageNotFound"))
  }
];

export default routes;

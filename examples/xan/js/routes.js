import { loadable } from "../../../lib/index";

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

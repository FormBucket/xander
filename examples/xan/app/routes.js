let routes = [{
    path: "/",
    component: (props) => "Hello, Xan."
}, {
    path: "*",
    component: ((props) => "No Page Found" )
}]

export default routes;

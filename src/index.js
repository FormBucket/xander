let routerStore;

let routes;

function router(opts) {
  routes = opts.routes
  router.router = require('./router')(routes)
  return router;
}

router.location = require('./location')
router.Link = require('./link')
router.Container = require('./container')

router.replaceRoutes = function(r) {
  routes = r;
  router.router = require('./router')(routes)
  return router;
}
module.exports = router

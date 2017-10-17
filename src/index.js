let routes;

function router(opts) {
  return replaceRoutes(opts.routes)
}

function replaceRoutes(r) {
  routes = r;
  router.router = require('./router')(routes)
  return router;
}

router.location = require('./location');
router.Link = require('./link');
router.Container = require('./container');
router.replaceRoutes = replaceRoutes;

module.exports = router;

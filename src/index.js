let routerStore;

function router(opts) {
  router.router = require('./router')(opts)
  return router;
}

router.location = require('./location')
router.Link = require('./link')
router.Container = require('./container')

module.exports = router

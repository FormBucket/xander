var router = require('rootr')

router.Link = require('./link');
router.Container = require('./container');
router.connectStore = require('./connect');
router.default = router;

module.exports = router;

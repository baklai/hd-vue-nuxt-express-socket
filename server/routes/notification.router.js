const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const { findAll, createMany, removeOne } = require('../controllers/notification.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:notification:find:all'), findAll)
  .post(jwtScope('api:notification:create:many'), createMany);

router.route('/:id').delete(jwtScope('api:notification:remove:one'), removeOne);

module.exports = router;

const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/vpn.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:vpn:find:all'), findAll)
  .post(jwtScope('api:vpn:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:vpn:find:one'), findOne)
  .put(jwtScope('api:vpn:update:one'), updateOne)
  .delete(jwtScope('api:vpn:remove:one'), removeOne);

module.exports = router;

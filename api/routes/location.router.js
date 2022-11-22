const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/location.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:location:find:all'), findAll)
  .post(jwtScope('api:location:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:location:find:one'), findOne)
  .put(jwtScope('api:location:update:one'), updateOne)
  .delete(jwtScope('api:location:remove:one'), removeOne);

module.exports = router;

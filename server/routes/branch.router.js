const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/branch.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:branch:find:all'), findAll)
  .post(jwtScope('api:branch:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:branch:find:one'), findOne)
  .put(jwtScope('api:branch:update:one'), updateOne)
  .delete(jwtScope('api:branch:remove:one'), removeOne);

module.exports = router;

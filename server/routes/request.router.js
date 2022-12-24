const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/request.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:request:find:all'), findAll)
  .post(jwtScope('api:request:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:request:find:one'), findOne)
  .put(jwtScope('api:request:update:one'), updateOne)
  .delete(jwtScope('api:request:remove:one'), removeOne);

module.exports = router;

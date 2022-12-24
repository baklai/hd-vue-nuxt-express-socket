const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/position.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:position:find:all'), findAll)
  .post(jwtScope('api:position:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:position:find:one'), findOne)
  .put(jwtScope('api:position:update:one'), updateOne)
  .delete(jwtScope('api:position:remove:one'), removeOne);

module.exports = router;

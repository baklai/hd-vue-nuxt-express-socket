const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/unit.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:unit:find:all'), findAll)
  .post(jwtScope('api:unit:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:unit:find:one'), findOne)
  .put(jwtScope('api:unit:update:one'), updateOne)
  .delete(jwtScope('api:unit:remove:one'), removeOne);

module.exports = router;

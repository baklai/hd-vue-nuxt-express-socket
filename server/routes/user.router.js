const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/user.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:user:find:all'), findAll)
  .post(jwtScope('api:user:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:user:find:one'), findOne)
  .put(jwtScope('api:user:update:one'), updateOne)
  .delete(jwtScope('api:user:remove:one'), removeOne);

module.exports = router;

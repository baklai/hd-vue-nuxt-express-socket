const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/department.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:department:find:all'), findAll)
  .post(jwtScope('api:department:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:department:find:one'), findOne)
  .put(jwtScope('api:department:update:one'), updateOne)
  .delete(jwtScope('api:department:remove:one'), removeOne);

module.exports = router;

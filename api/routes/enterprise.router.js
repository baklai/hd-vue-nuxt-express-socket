const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/enterprise.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:enterprise:find:all'), findAll)
  .post(jwtScope('api:enterprise:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:enterprise:find:one'), findOne)
  .put(jwtScope('api:enterprise:update:one'), updateOne)
  .delete(jwtScope('api:enterprise:remove:one'), removeOne);

module.exports = router;

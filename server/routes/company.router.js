const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/company.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:company:find:all'), findAll)
  .post(jwtScope('api:company:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:company:find:one'), findOne)
  .put(jwtScope('api:company:update:one'), updateOne)
  .delete(jwtScope('api:company:remove:one'), removeOne);

module.exports = router;

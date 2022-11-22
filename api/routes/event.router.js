const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/event.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:event:find:all'), findAll)
  .post(jwtScope('api:event:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:event:find:one'), findOne)
  .put(jwtScope('api:event:update:one'), updateOne)
  .delete(jwtScope('api:event:remove:one'), removeOne);

module.exports = router;

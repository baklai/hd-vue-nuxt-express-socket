const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/channel.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:channel:find:all'), findAll)
  .post(jwtScope('api:channel:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:channel:find:one'), findOne)
  .put(jwtScope('api:channel:update:one'), updateOne)
  .delete(jwtScope('api:channel:remove:one'), removeOne);

module.exports = router;

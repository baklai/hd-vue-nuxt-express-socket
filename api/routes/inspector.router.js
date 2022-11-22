const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/inspector.controller');

const router = Router({ mergeParams: true });

router.route('/').get(jwtScope('api:inspector:find:all'), findAll).post(jwtScope(''), createOne);

router
  .route('/:id')
  .get(jwtScope('api:inspector:find:one'), findOne)
  .put(jwtScope(''), updateOne)
  .delete(jwtScope('api:inspector:remove:one'), removeOne);

module.exports = router;

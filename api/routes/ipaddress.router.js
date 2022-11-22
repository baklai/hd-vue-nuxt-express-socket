const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  findAll,
  findOne,
  searchOne,
  createOne,
  updateOne,
  removeOne
} = require('../controllers/ipaddress.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:ipaddress:find:all'), findAll)
  .post(jwtScope('api:ipaddress:create:one'), createOne);

router
  .route('/:id')
  .get(jwtScope('api:ipaddress:find:one'), findOne)
  .put(jwtScope('api:ipaddress:update:one'), updateOne)
  .delete(jwtScope('api:ipaddress:remove:one'), removeOne);

router.route('/search/:ipaddress').get(jwtScope('api:ipaddress:search:one'), searchOne);

module.exports = router;

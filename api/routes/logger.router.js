const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const { findAll, removeAll } = require('../controllers/logger.controller');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(jwtScope('api:logger:find:all'), findAll)
  .delete(jwtScope('api:logger:remove:all'), removeAll);

module.exports = router;

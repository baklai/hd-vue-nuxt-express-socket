const { Router } = require('express');

const jwtScope = require('../middleware/scope');

const {
  getInspector,
  getRDP,
  getVNC,
  getPING,
  getOPING
} = require('../controllers/tool.controller');

const router = Router({ mergeParams: true });

router.route('/inspector').get(jwtScope('api:tool:get:inspector'), getInspector);

router.route('/rdp').get(jwtScope('api:tool:get:rdp'), getRDP);

router.route('/vnc').get(jwtScope('api:tool:get:vnc'), getVNC);

router.route('/ping').get(jwtScope('api:tool:get:ping'), getPING);

router.route('/ping-online').get(jwtScope('api:tool:get:oping'), getOPING);

module.exports = router;

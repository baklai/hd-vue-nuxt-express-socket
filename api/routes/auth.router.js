const { Router } = require('express');

const { signin, signout, refresh, me } = require('../controllers/auth.controller');

const router = Router({ mergeParams: true });

router.post('/signin', signin);

router.post('/signout', signout);

router.post('/refresh', refresh);

router.get('/me', me);

module.exports = router;

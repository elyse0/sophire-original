var express = require('express');
var router = express.Router();

const videos_api_get = require('/routes/videos_api/videos_api_get').router
const videos_api_post = require('/routes/videos_api/videos_api_post')

router.use('/', videos_api_get)
router.use('/', videos_api_post)

module.exports = router;

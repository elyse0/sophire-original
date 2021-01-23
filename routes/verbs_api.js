const express = require('express');
const router = express.Router();

const verbsApiGet = require('/routes/verbs_api/verbs_api_get')
const verbsApiPost = require('/routes/verbs_api/verbs_api_post')
const verbsApiPatch = require('/routes/verbs_api/verbs_api_patch')
const verbsApiDelete = require('/routes/verbs_api/verbs_api_delete')

// REST API  /verbs/*

router.use('/', verbsApiGet)
router.use('/', verbsApiPost)
router.use('/', verbsApiPatch)
router.use('/', verbsApiDelete)

module.exports = router;
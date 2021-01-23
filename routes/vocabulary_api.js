const express = require('express');
const router = express.Router();

const vocabularyApiGet = require('/routes/vocabulary_api/vocabulary_api_get')
const vocabularyApiPost = require('/routes/vocabulary_api/vocabulary_api_post')
const vocabularyApiPatch = require('/routes/vocabulary_api/vocabulary_api_patch')
const vocabularyApiDelete = require('/routes/vocabulary_api/vocabulary_api_delete')

// REST API  /vocabulary/*

router.use('/', vocabularyApiGet)
router.use('/', vocabularyApiPost)
router.use('/', vocabularyApiPatch)
router.use('/', vocabularyApiDelete)

module.exports = router;
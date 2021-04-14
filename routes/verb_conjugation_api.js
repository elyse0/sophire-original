const express = require('express');
const router = express.Router();

const verb_conjugation_get = require('/routes/verb_conjugation_api/verb_conjugation_get')
const verb_conjugation_post = require('/routes/verb_conjugation_api/verb_conjugation_post')

// REST API  /vocabulary/*

router.use('/', verb_conjugation_get)
router.use('/', verb_conjugation_post)

module.exports = router;
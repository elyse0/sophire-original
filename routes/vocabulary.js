const express = require('express');
const router = express.Router();

const vocabularyRandom = require('/routes/vocabulary/vocabulary_random')
const vocabularyIndex = require('/routes/vocabulary/vocabulary_index')
const vocabularyCategories = require('/routes/vocabulary/vocabulary_categories')

router.use('/', vocabularyIndex)            // Path: /vocabulary/
router.use('/random', vocabularyRandom)     // Path: /vocabulary/random
router.use('/', vocabularyCategories)       // Path: /vocabulary/:category

module.exports = router;
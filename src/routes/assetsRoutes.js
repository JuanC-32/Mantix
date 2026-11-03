const express = require('express');
const assetsController = require('../controllers/assetsController');

const router = express.Router();

router.get('/', assetsController.listAssets);
router.post('/', assetsController.createAsset);
router.patch('/:id', assetsController.patchAsset);

module.exports = router;

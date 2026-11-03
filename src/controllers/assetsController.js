const assetsRepository = require('../repositories/assetsRepository');

async function listAssets(req, res) {
    try {
        const assets = await assetsRepository.findAll();
        res.status(200).json({
            status: 'success',
            data: assets
        });
    } catch (error) {
        console.error('Could not list assets:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Could not retrieve assets'
        });
    }
}

module.exports = { listAssets };

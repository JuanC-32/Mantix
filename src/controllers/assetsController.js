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

async function createAsset(req, res) {
    const body = req.body ?? {};
    const assetCode = typeof body.asset_code === 'string' ? body.asset_code.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!assetCode || !name) {
        return res.status(400).json({
            status: 'error',
            message: 'asset_code and name are required strings'
        });
    }

    if (assetCode.length > 50 || name.length > 150) {
        return res.status(400).json({
            status: 'error',
            message: 'asset_code must be at most 50 characters and name at most 150 characters'
        });
    }

    const optionalText = (value) => {
        if (value === undefined || value === null || value === '') return null;
        if (typeof value !== 'string') return undefined;
        return value.trim() || null;
    };

    const description = optionalText(body.description);
    const location = optionalText(body.location);

    if (description === undefined || location === undefined) {
        return res.status(400).json({
            status: 'error',
            message: 'description and location must be strings when provided'
        });
    }

    try {
        const id = await assetsRepository.create({
            asset_code: assetCode,
            name,
            description,
            location
        });
        const asset = await assetsRepository.findById(id);

        return res.status(201).json({
            status: 'success',
            data: asset
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'An asset with this asset_code already exists'
            });
        }

        console.error('Could not create asset:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Could not create asset'
        });
    }
}

module.exports = { listAssets, createAsset };

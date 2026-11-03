const assetsRepository = require('../repositories/assetsRepository');

async function listAssets(req, res) {
    try {
        const assets = await assetsRepository.findAll();
        return res.status(200).json({
            status: 'success',
            data: assets
        });
    } catch (error) {
        console.error('Could not list assets:', error.message);
        return res.status(500).json({
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

    if (location && location.length > 150) {
        return res.status(400).json({
            status: 'error',
            message: 'location must be at most 150 characters'
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

async function patchAsset(req, res) {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            status: 'error',
            message: 'id must be a positive integer'
        });
    }

    const body = req.body;
    const allowedFields = ['asset_code', 'name', 'description', 'location'];

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            status: 'error',
            message: 'Request body must be a JSON object'
        });
    }

    const submittedFields = Object.keys(body);
    const unsupportedFields = submittedFields.filter((field) => !allowedFields.includes(field));

    if (submittedFields.length === 0 || unsupportedFields.length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Provide at least one supported field: asset_code, name, description, location'
        });
    }

    const changes = {};

    for (const field of submittedFields) {
        const value = body[field];

        if (field === 'description' || field === 'location') {
            if (value !== null && typeof value !== 'string') {
                return res.status(400).json({
                    status: 'error',
                    message: `${field} must be a string or null`
                });
            }

            const normalizedValue = typeof value === 'string' ? value.trim() || null : null;
            const maximumLength = field === 'location' ? 150 : Infinity;

            if (normalizedValue && normalizedValue.length > maximumLength) {
                return res.status(400).json({
                    status: 'error',
                    message: `${field} is too long`
                });
            }

            changes[field] = normalizedValue;
            continue;
        }

        if (typeof value !== 'string' || !value.trim()) {
            return res.status(400).json({
                status: 'error',
                message: `${field} must be a non-empty string`
            });
        }

        const normalizedValue = value.trim();
        const maximumLength = field === 'asset_code' ? 50 : 150;

        if (normalizedValue.length > maximumLength) {
            return res.status(400).json({
                status: 'error',
                message: `${field} must be at most ${maximumLength} characters`
            });
        }

        changes[field] = normalizedValue;
    }

    try {
        const existingAsset = await assetsRepository.findById(id);

        if (!existingAsset) {
            return res.status(404).json({
                status: 'error',
                message: 'Asset not found'
            });
        }

        await assetsRepository.update(id, changes);
        const updatedAsset = await assetsRepository.findById(id);

        return res.status(200).json({
            status: 'success',
            data: updatedAsset
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'An asset with this asset_code already exists'
            });
        }

        console.error('Could not update asset:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Could not update asset'
        });
    }
}

module.exports = { listAssets, createAsset, patchAsset };

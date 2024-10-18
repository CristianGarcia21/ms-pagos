const validatePaymentData = (req, res, next) => {
    const requiredFields = [
        'card_number',
        'exp_year',
        'exp_month',
        'cvc',
        'name',
        'email',
        'amount'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Missing required payment information',
            requiredFields: missingFields
        });
    }

    // Validar formato de tarjeta
    if (req.body.card_number.length < 15 || req.body.card_number.length > 16) {
        return res.status(400).json({
            success: false,
            message: 'Invalid card number length'
        });
    }

    // Validar CVC
    if (req.body.cvc.length < 3 || req.body.cvc.length > 4) {
        return res.status(400).json({
            success: false,
            message: 'Invalid CVC length'
        });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Validar que el nombre tenga al menos dos partes
    const nameParts = req.body.name.split(' ');
    if (nameParts.length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Please provide both first and last name'
        });
    }

    next();
};

const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required'
        });
    }

    const validApiKey = process.env.API_KEY || 'test-api-key-123';

    if (apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key'
        });
    }

    next();
};

module.exports = {
    validateApiKey,
    validatePaymentData
};
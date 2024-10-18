const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/epaycoController');
const { validateApiKey, validatePaymentData } = require('../middleware/authMiddleware');

// Aplicar validación de API key a todas las rutas
router.use(validateApiKey);

// Ruta de procesamiento de pago con validación de datos
router.post('/process', validatePaymentData, PaymentController.processPayment);

module.exports = router;
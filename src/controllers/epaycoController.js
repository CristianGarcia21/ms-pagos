const PaymentService = require('../services/epaycoService');
const ResponseHandler = require('../utils/response.handler');

class PaymentController {
    async processPayment(req, res) {
        try {
            const paymentData = req.body;
            const result = await PaymentService.processPayment(paymentData);
            
            return ResponseHandler.success(
                res, 
                result, 
                'Payment processed successfully'
            );
        } catch (error) {
            return ResponseHandler.error(
                res, 
                error,
                error.status || 400
            );
        }
    }
}

module.exports = new PaymentController();
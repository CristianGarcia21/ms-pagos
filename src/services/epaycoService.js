const epayco = require('../config/epaycoConfig');

class PaymentService {
    async processPayment(paymentData) {
        try {
            // Separar el nombre completo en nombre y apellido
            const [firstName, ...lastNameParts] = paymentData.name.split(' ');
            const lastName = lastNameParts.join(' ');

            const credit_info = {
                "card[number]": paymentData.card_number,
                "card[exp_year]": paymentData.exp_year,
                "card[exp_month]": paymentData.exp_month,
                "card[cvc]": paymentData.cvc
            };

            const payment_info = {
                name: firstName,
                last_name: lastName || 'Not Provided', // Aseguramos que siempre haya un apellido
                email: paymentData.email,
                description: paymentData.description,
                invoice: `INV-${Date.now()}`,
                currency: "COP",
                amount: paymentData.amount,
                tax_base: "0",
                tax: "0",
                country: "CO",
                test: true,
                doc_type: "CC",
                doc_number: paymentData.doc_number || "1234567890"
            };

            // Crear token de tarjeta
            const token = await epayco.token.create(credit_info);

            if (!token.status) {
                throw new Error('Error creating card token');
            }

            // Crear cliente
            const customer = await epayco.customers.create({
                token_card: token.id,
                name: firstName,
                last_name: lastName || 'Not Provided',
                email: paymentData.email,
                default: true,
                city: paymentData.city || "Bogotá",
                address: paymentData.address || "Dirección de prueba",
                phone: paymentData.phone || "3123456789",
                cell_phone: paymentData.cell_phone || "3123456789"
            });

            if (!customer.status) {
                throw new Error('Error creating customer');
            }

            // Realizar el pago
            const payment = await epayco.charge.create({
                token_card: token.id,
                customer_id: customer.data.customerId,
                doc_type: payment_info.doc_type,
                doc_number: payment_info.doc_number,
                name: payment_info.name,
                last_name: payment_info.last_name,
                email: payment_info.email,
                bill: payment_info.invoice,
                description: payment_info.description,
                value: payment_info.amount,
                tax: payment_info.tax,
                tax_base: payment_info.tax_base,
                currency: payment_info.currency,
                dues: paymentData.dues || "1"
            });

            return payment;
        } catch (error) {
            console.error('Payment Error:', error);
            throw new Error(`Payment processing error: ${error.message}`);
        }
    }
}

module.exports = new PaymentService();
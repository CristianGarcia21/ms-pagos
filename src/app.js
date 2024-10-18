const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const paymentRoutes = require('./routes/epaycoRoutes');

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ePayco payment service' });
});

// Routes
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/api/payments/process`);
});
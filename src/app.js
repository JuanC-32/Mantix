const express = require('express');
const assetsRoutes = require('./routes/assetsRoutes');

const app = express();

// Permite recibir y procesar JSON
app.use(express.json());

// Endpoint de diagnóstico
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Mantix API is running'
    });
});

// Rutas de equipos
app.use('/api/assets', assetsRoutes);

module.exports = app;

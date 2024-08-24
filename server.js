const express = require('express');
const path = require('path');

const app = express();

// Define la ruta estática al directorio 'browser'
app.use(express.static(path.join(__dirname, 'dist/f-gestiondemantenimiento/browser')));

// Cualquier otra ruta debe devolver el archivo index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/f-gestiondemantenimiento/browser/index.html'));
});

// Configura el puerto
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

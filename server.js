const express = require('express');
const path = require('path');

const app = express();

// Configura la ruta para servir archivos estáticos
app.use(express.static(__dirname + '/dist/f-gestiondemantenimiento/browser/browser'));

// Ruta para manejar todas las solicitudes y devolver el archivo index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/f-gestiondemantenimiento/browser/browser/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

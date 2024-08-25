const express = require('express');
const path = require('path');
const app = express();

// Ruta de la carpeta de distribución de tu aplicación Angular
const distFolder = path.join(__dirname, 'dist/f-gestiondemantenimiento');

// Servir archivos estáticos desde la carpeta de distribución
app.use(express.static(distFolder));

// Manejar todas las solicitudes y servir el archivo index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});

// Configurar el puerto para Heroku o un puerto predeterminado
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

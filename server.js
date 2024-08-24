const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde el directorio 'dist'
app.use(express.static(path.join(__dirname, 'dist', 'f_gestiondemantenimiento')));

// Redirigir todas las rutas al index.html de Angular
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'f_gestiondemantenimiento', 'index.html'));
});

// Escuchar en el puerto definido por Heroku
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

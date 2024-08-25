
// server.js
const express = require('express');
const path = require('path');
const app = express();

// Configura el servidor para servir la aplicación Angular
app.use(express.static(__dirname + '/dist/f-gestiondemantenimiento'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/f-gestiondemantenimiento/index.html'));
});

// Inicia el servidor en el puerto designado por Heroku o en el puerto 8080
app.listen(process.env.PORT || 8080);

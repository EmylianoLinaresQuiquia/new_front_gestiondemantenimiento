
// server.js
/*const express = require('express');
const path = require('path');
const app = express();

// Configura el servidor para servir la aplicación Angular
app.use(express.static(__dirname + '/dist/f-gestiondemantenimiento'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/f-gestiondemantenimiento/index.html'));
});

// Inicia el servidor en el puerto designado por Heroku o en el puerto 8080
app.listen(process.env.PORT || 8080);*/



const express = require('express');
const path = require('path');
const app = express();

// Servir la aplicación Angular Universal (SSR)
app.use(express.static(path.join(__dirname, 'dist/f-gestiondemantenimiento')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/f-gestiondemantenimiento', 'index.html'));
});

// Escuchar en el puerto proporcionado por Heroku o el puerto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

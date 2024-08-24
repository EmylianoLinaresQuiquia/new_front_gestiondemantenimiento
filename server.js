const express = require('express');
const path = require('path');
const app = express();

// Servir los archivos estáticos desde dist/f-gestiondemantenimiento
app.use(express.static(path.join(__dirname, 'dist/f-gestiondemantenimiento')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/f-gestiondemantenimiento/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { dirname, join, resolve } from 'path';  // Cambiar 'node:path' a 'path'
import bootstrap from './src/main.server';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(new URL(import.meta.url, import.meta.url)));  // Utiliza URL para obtener __dirname

export function app(): express.Express {
  const server = express();
  const serverDistFolder = resolve(__dirname, '../dist/f_gestiondemantenimiento/browser');  // Ajusta la ruta
  const indexHtml = join(serverDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', serverDistFolder);

  // Servir archivos estáticos desde la nueva ubicación
  server.get('*.*', express.static(serverDistFolder, {
    maxAge: '1y',
    index: false,
  }));

  // Todas las rutas regulares usan el motor Angular
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: serverDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Iniciar el servidor Node
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

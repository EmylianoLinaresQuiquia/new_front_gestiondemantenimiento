import express from 'express';
import path from 'path';
const { CommonEngine } = require('@angular/ssr');
const { APP_BASE_HREF } = require('@angular/common');
const { mainServer } = require('./src/main.server');

const app = express();
const port = process.env.PORT || 4000;

const browserDistFolder = path.resolve(__dirname, '../dist/f-gestiondemantenimiento');
const indexHtml = path.join(browserDistFolder, 'index.html');
const commonEngine = new CommonEngine();

app.set('view engine', 'html');
app.set('views', browserDistFolder);

// Serve static files from the root of the dist directory
app.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
}));

// All regular routes use the Angular engine
app.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine.render({
        bootstrap: mainServer,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then(html => res.send(html))
    .catch(err => next(err));
});

app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
});

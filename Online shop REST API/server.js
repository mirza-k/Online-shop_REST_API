const http = require('http');
const app = require('./app.js');

const port = process.env.PORT || 1333
const server = http.createServer(app);

server.listen(port);
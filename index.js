const { connection, config } = require('./config/connection');
const express = require('express');
const app = express();
const routeHandler = require('./src/routes/index');
const { checkTables } = require('./config/table');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token');
});

app.use('/api', routeHandler(config));

app.all('*', (req, res) => {
  res.status(404).send({
    error: 'resource not found',
  });
});

const server = app.listen(config.port, () => {
  console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
  checkTables();
});

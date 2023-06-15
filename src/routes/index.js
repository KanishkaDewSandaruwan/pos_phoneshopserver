const express = require('express');
const userRoute = require('./user/user');

module.exports = (config) => {
  const router = express.Router();

  router.use('/user', userRoute(config));

  return router;
};


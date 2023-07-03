const express = require('express');
const userRoute = require('./user/user');
const supplierRoute = require('./supplier/supplier');
const categoryRoute = require('./category/category');
const subcategoryRoute = require('./subcategory/subcategory');
const itemRoute = require('./item/item');
const shopRoute = require('./shop/shop');

module.exports = (config) => {
  const router = express.Router();

  router.use('/user', userRoute(config));
  router.use('/supplier', supplierRoute(config));
  router.use('/category', categoryRoute(config));
  router.use('/subcategory', subcategoryRoute(config));
  router.use('/item', itemRoute(config));
  router.use('/shop', shopRoute(config));

  return router;
};


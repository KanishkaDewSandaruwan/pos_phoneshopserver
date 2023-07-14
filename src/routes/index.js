const express = require('express');
const userRoute = require('./user/user');
const supplierRoute = require('./supplier/supplier');
const categoryRoute = require('./category/category');
const subcategoryRoute = require('./subcategory/subcategory');
const itemRoute = require('./item/item');
const shopRoute = require('./shop/shop');
const branchRoute = require('./branch/branch');
const userroleRoute = require('./userrole/userrole');

module.exports = (config) => {
  const router = express.Router();

  router.use('/user', userRoute(config));
  router.use('/supplier', supplierRoute(config));
  router.use('/category', categoryRoute(config));
  router.use('/subcategory', subcategoryRoute(config));
  router.use('/item', itemRoute(config));
  router.use('/branch', branchRoute(config));
  router.use('/shop', shopRoute(config));
  router.use('/userrole', userroleRoute(config));

  return router;
};


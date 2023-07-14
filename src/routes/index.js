const express = require('express');
const userRoute = require('./user/user');
const supplierRoute = require('./supplier/supplier');
const categoryRoute = require('./category/category');
const subcategoryRoute = require('./subcategory/subcategory');
const itemRoute = require('./item/item');
const shopRoute = require('./shop/shop');
const branchRoute = require('./branch/branch');
const userroleRoute = require('./userrole/userrole');
const colorRoute = require('./color/color');
const brandRoute = require('./brands/brands');

module.exports = (config) => {
  const router = express.Router();

  //access control routes
  router.use('/user', userRoute(config));
  router.use('/branch', branchRoute(config));
  router.use('/shop', shopRoute(config));
  router.use('/userrole', userroleRoute(config));
  
  //need routes
  router.use('/supplier', supplierRoute(config));
  router.use('/item', itemRoute(config));
  
  //filter routes
  router.use('/category', categoryRoute(config));
  router.use('/subcategory', subcategoryRoute(config));
  router.use('/color', colorRoute(config));
  router.use('/brand', brandRoute(config));

  return router;
};


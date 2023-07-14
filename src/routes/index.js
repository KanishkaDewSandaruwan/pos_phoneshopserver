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
  router.use('/user', userRoute(config)); //admin user only
  router.use('/branch', branchRoute(config)); //admin user only
  router.use('/shop', shopRoute(config)); //admin user only
  
  router.use('/userrole', userroleRoute(config)); //super admin only
  
  //need routes
  router.use('/supplier', supplierRoute(config));   //any user
  router.use('/item', itemRoute(config));   //any user
  
  //filter routes
  router.use('/category', categoryRoute(config)); //admin user only
  router.use('/subcategory', subcategoryRoute(config)); //admin user only
  router.use('/color', colorRoute(config)); //admin user only
  router.use('/brand', brandRoute(config)); //admin user only

  return router;
};


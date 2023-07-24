const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  permanentDeleteCategory,
  updateCategoryImage,
  deleteCategories
} = require('../../controllers/category/CategoryController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');
const { uploadCategory } = require('../../../config/fileUpload');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', uploadCategory.single('catimage'), authorizeAccessControll, addCategory);
  router.use('/image', express.static('src/uploads/category/'));
  router.get('/all', authorizeAccessControll, getAllCategories);
  router.get('/:categoryId', authorizeAccessControll, getCategoryById);
  router.put('/status/:categoryId', authorizeAccessControll, updateCategoryStatus);
  router.put('/delete/:categoryId', authorizeAccessControll, deleteCategory);
  router.put('/delete', authorizeAccessControll, deleteCategories);
  router.put('/update/:categoryId', authorizeAccessControll, updateCategory);
  router.put('/update/catimage/:categoryId', uploadCategory.single('catimage'),  authorizeAccessControll, updateCategoryImage);

  return router;
};

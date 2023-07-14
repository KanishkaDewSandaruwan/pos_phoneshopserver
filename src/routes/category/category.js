const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  permanentDeleteCategory,
  deleteCategories
} = require('../../controllers/category/CategoryController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addCategory);
  router.get('/all', authenticateToken, getAllCategories);
  router.get('/:categoryId', authenticateToken, getCategoryById);
  router.put('/status/:categoryId', authenticateToken, updateCategoryStatus);
  router.put('/delete/:categoryId', authenticateToken, deleteCategory);
  router.put('/delete', authenticateToken, deleteCategories);
  router.put('/update/:categoryId', authenticateToken, updateCategory);

  return router;
};

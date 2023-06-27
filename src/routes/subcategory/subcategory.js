const express = require('express');
const {
  getAllSubcategories,
  getSubcategoryById,
  addSubcategory,
  updateSubcategory,
  updateSubcategoryStatus,
  deleteSubcategory,
  permanentDeleteSubcategory,
  deleteSubcategories
} = require('../../controllers/SubcategoryController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addSubcategory);
  router.get('/all', authenticateToken, getAllSubcategories);
  router.get('/:subcategoryId', authenticateToken, getSubcategoryById);
  router.put('/status/:subcategoryId', authenticateToken, updateSubcategoryStatus);
  router.put('/delete/:subcategoryId', authenticateToken, deleteSubcategory);
  router.put('/delete', authenticateToken, deleteSubcategories);
  router.put('/update/:subcategoryId', authenticateToken, updateSubcategory);

  return router;
};

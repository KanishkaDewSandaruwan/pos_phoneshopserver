const express = require('express');
const {
  getAllBrands,
  getBrandById,
  addBrand,
  updateBrand,
  updateBrandStatus,
  deleteBrand,
  permanentDeleteBrand,
  deleteBrands
} = require('../../controllers/brands/BrandController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addBrand);
  router.get('/all', authenticateToken, getAllBrands);
  router.get('/:brandId', authenticateToken, getBrandById);
  router.put('/status/:brandId', authenticateToken, updateBrandStatus);
  router.put('/delete/:brandId', authenticateToken, deleteBrand);
  router.put('/delete', authenticateToken, deleteBrands);
  router.put('/update/:brandId', authenticateToken, updateBrand);

  return router;
};

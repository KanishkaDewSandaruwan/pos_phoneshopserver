const express = require('express');
const {
  getAllColors,
  getColorById,
  addColor,
  updateColor,
  updateColorStatus,
  deleteColor,
  permanentDeleteColor,
  deleteColors
} = require('../../controllers/colors/ColorController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addColor);
  router.get('/all', authenticateToken, getAllColors);
  router.get('/:colorId', authenticateToken, getColorById);
  router.put('/status/:colorId', authenticateToken, updateColorStatus);
  router.put('/delete/:colorId', authenticateToken, deleteColor);
  router.put('/delete', authenticateToken, deleteColors);
  router.put('/update/:colorId', authenticateToken, updateColor);

  return router;
};

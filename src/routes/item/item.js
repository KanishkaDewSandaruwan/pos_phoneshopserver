const express = require('express');
const {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
} = require('../../controllers/ItemController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addItem);
  router.get('/all', authenticateToken, getAllItems);
  router.get('/:itemId', authenticateToken, getItemById);
  router.put('/update/:itemId', authenticateToken, updateItem);
  router.delete('/delete/:itemId', authenticateToken, deleteItem);

  return router;
};

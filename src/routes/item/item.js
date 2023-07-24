const express = require('express');
const {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  deleteItems
} = require('../../controllers/item/ItemController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addItem);
  router.get('/all', authenticateToken, getAllItems);
  router.get('/:itemId', authenticateToken, getItemById);
  router.put('/update/:itemId', authenticateToken, updateItem);
  router.put('/delete/:itemId', authenticateToken, deleteItem);
  router.put('/delete', authenticateToken, deleteItems);

  return router;
};

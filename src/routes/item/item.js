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
const { uploadItem } = require('../../../config/fileUpload');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', uploadItem.single('item'), authenticateToken, addItem);
  router.use('/getitem', express.static('src/uploads/item/'));
  router.get('/all', authenticateToken, getAllItems);
  router.get('/:itemId', authenticateToken, getItemById);
  router.put('/update/:itemId', authenticateToken, updateItem);
  router.put('/delete/:itemId', authenticateToken, deleteItem);
  router.put('/delete', authenticateToken, deleteItems);
  


  return router;
};

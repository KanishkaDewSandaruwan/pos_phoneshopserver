const express = require('express');
const {
  getAllItems,
  getItemById,
  getAllItemsBybranch,
  addItem,
  addNewitemPrice,
  updateItem,
  deleteItem,
  deleteItems,
  getPriceBybranchId,
  updateItemImage
} = require('../../controllers/item/ItemController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { uploadItem } = require('../../../config/fileUpload');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', uploadItem.single('item'), authenticateToken, addItem);
  router.post('/upload/:itemId', uploadItem.single('item'), authenticateToken, updateItemImage);
  router.use('/getitem', express.static('src/uploads/item/'));
  router.get('/allBybranch', authenticateToken, getAllItemsBybranch);
  router.get('/all/comon', authenticateToken, getAllItems);
  router.get('/:itemId', authenticateToken, getItemById);
  router.put('/update/:itemId', authenticateToken, updateItem);
  router.put('/delete/:itemId', authenticateToken, deleteItem);
  router.put('/delete', authenticateToken, deleteItems);
  router.post('/createPrice', authenticateToken, addNewitemPrice);

  router.get('/pricee/getp', authenticateToken, getPriceBybranchId);
  
  


  return router;
};

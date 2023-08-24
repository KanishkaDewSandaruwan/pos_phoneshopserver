const express = require('express');
const {
  getAllStocks,
  getStockById,
  addStock,
  updateStockQty,
  deleteStock,
  getAllStocksBranch,
  permanentDeleteStock,
} = require('../../mvc/stock/StockController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessControll, addStock);
  router.get('/all', authorizeAccessControll, getAllStocks);
  router.get('/branch/all/:branch_id', authorizeAccessControll, getAllStocksBranch);
  router.get('/:stockId', authorizeAccessControll, getStockById);
  router.put('/update/:stockId', authorizeAccessControll, updateStockQty);
  router.put('/delete/:stockId', authorizeAccessControll, deleteStock);
  router.put('/permanent-delete/:stockId', authorizeAccessControll, permanentDeleteStock);

  return router;
};

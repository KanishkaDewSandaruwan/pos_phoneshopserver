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

  router.post('/create', authenticateToken, addStock);
  router.get('/all', authenticateToken, getAllStocks);
  router.get('/branch/all/:branch_id', authenticateToken, getAllStocksBranch);
  router.get('/:stockId', authenticateToken, getStockById);
  router.put('/update/:stockId', authenticateToken, updateStockQty);
  router.put('/delete/:stockId', authenticateToken, deleteStock);
  router.put('/permanent-delete/:stockId', authenticateToken, permanentDeleteStock);

  return router;
};

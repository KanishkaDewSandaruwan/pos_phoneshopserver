const express = require('express');
const {
  getAllStocks,
  getStockById,
  deleteStock,
  getAllStockByBranch,
  permanentDeleteStock,
  getAllStockInallBranches
} = require('../../mvc/stock/StockController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.get('/all/comon', authenticateToken, getAllStocks);
  router.get('/allBybranch/:branch_id', authenticateToken, getAllStockByBranch);
  router.get('/all/BranchesStockes', authenticateToken, getAllStockInallBranches);
  router.get('/:stockId', authenticateToken, getStockById);
  router.put('/delete/:stockId', authenticateToken, deleteStock);
  router.delete('/permanent-delete/:stockId', authenticateToken, permanentDeleteStock);

  return router;
};

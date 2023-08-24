const StockModel = require('./StockModel');

const getAllStocks = (req, res) => {
  const { branch_id } = req.params;
  StockModel.getAllStocksInBranch(branch_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getAllStocksBranch = (req, res) => {
  const { branch_id } = req.params;
  StockModel.getAllStocksInBranch(branch_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getStockById = (req, res) => {
  const { stockId } = req.params;
  StockModel.getStockById(stockId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Stock not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addStock = (req, res) => {
  const stock = req.body;

  // Check if stock with the same itemid and branch_id already exists
  StockModel.getStockByItemAndBranch(stock.itemid, stock.branch_id, (error, existingStock) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (existingStock.length > 0) {
      res.status(409).send({ error: 'Stock with the same item and branch already exists' });
      return;
    }

    // If no existing stock, proceed to add the new stock
    StockModel.addStock(stock, (error, stockId) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (!stockId) {
        res.status(404).send({ error: 'Failed to create stock' });
        return;
      }

      res.status(200).send({ message: 'Stock created successfully', stockId });
    });
  });
};


const updateStockQty = (req, res) => {
  const { stockId } = req.params;
  const stock = req.body;

  StockModel.updateStockQty(stock, stockId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error updating stock quantity in the database' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send({ error: 'Stock not found or no changes made' });
      return;
    }

    res.status(200).send({ message: 'Stock quantity updated successfully' });
  });
};

const deleteStock = (req, res) => {
  const { stockId } = req.params;

  StockModel.deleteStock(stockId, 1, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error updating deletion in the database' });
      return;
    }

    res.status(200).send({ message: 'Stock deleted successfully' });
  });
};

const permanentDeleteStock = (req, res) => {
  const { stockId } = req.params;

  StockModel.permanentDeleteStock(stockId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting stock from the database' });
      return;
    }

    res.status(200).send({ message: 'Stock permanently deleted successfully' });
  });
};

module.exports = {
  getAllStocks,
  getAllStocksBranch,
  getStockById,
  addStock,
  updateStockQty,
  deleteStock,
  permanentDeleteStock,
};

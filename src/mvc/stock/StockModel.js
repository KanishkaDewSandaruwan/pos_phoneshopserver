const { connection } = require('../../../config/config');

const StockModel = {
    getStockById(stockId, callback) {
        connection.query('SELECT * FROM stock WHERE stockid = ? AND is_delete = 0', [stockId], callback);
    },

    getAllStocksInBranch(branch_id, callback) {
        connection.query('SELECT * FROM stock WHERE is_delete = 0 AND branch_id = ?', [branch_id], callback);
    },

    getAllStocksInBranch(callback) {
        connection.query('SELECT * FROM stock WHERE is_delete = 0 ', callback);
    },

    getStockByItemAndBranch(itemid, branch_id, callback) {
        const query = 'SELECT * FROM stock WHERE itemid = ? AND branch_id = ? AND is_delete = 0';
        const values = [itemid, branch_id];

        connection.query(query, values, callback);
    },

    addStock(stock, callback) {
        const { itemid, qty, branch_id } = stock;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;

        const query = 'INSERT INTO stock (itemid, qty, branch_id, trndate, is_delete) VALUES (?, ?, ?, ?, ?)';
        const values = [itemid, qty, branch_id, trndate, defaultValues];

        connection.query(query, values, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }

            const stockId = results.insertId;
            callback(null, stockId);
        });
    },

    updateStockQty(stock, stockId, callback) {
        const { qty } = stock;
        const query = 'UPDATE stock SET qty = ? WHERE stockid = ?';
        const values = [qty, stockId];

        connection.query(query, values, callback);
    },

    deleteStock(stockId, value, callback) {
        const query = 'UPDATE stock SET is_delete = ? WHERE stockid = ?';
        const values = [value, stockId];

        connection.query(query, values, callback);
    },

    getStockByIdPromise(stockId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM stock WHERE stockid = ?', [stockId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
};

module.exports = StockModel;

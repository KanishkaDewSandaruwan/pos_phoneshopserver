const { connection } = require('../../../config/connection');

const StockModel = {
    getStockById(stockId, callback) {
        connection.query('SELECT * FROM stock WHERE stockid = ? AND is_delete = 0', [stockId], callback);
    },

    getAllStocksInBranch(branch_id, callback) {
        connection.query('SELECT * FROM stock JOIN item ON stock.itemid = item.itemid WHERE stock.is_delete = 0 AND item.is_delete = 0 AND stock.branch_id = ?', [branch_id], callback);
    },
    
    getAllStockInallBranches(callback) {
        connection.query('SELECT * FROM stock JOIN item ON stock.itemid = item.itemid WHERE stock.is_delete = 0 AND item.is_delete = 0', callback);
    }, 

    getAllStocks(callback) {
        connection.query('SELECT * FROM stock WHERE is_delete = 0 ', callback);
    },

    getStockByItemAndBranch(itemid, branch_id, callback) {
        const query = 'SELECT * FROM stock WHERE itemid = ? AND branch_id = ? AND is_delete = 0';
        const values = [itemid, branch_id];

        connection.query(query, values, callback);
    },

    updateDetailsInStock(grnqty, itemid, branch_id, callback) {
        const query = 'UPDATE stock SET qty = qty + ? WHERE itemid = ? AND branch_id = ?';
        const values = [grnqty, itemid, branch_id];
        connection.query(query, values, callback);
    },

    addnewStokes(grnqty, itemid, branch_id, callback) {
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        //const activeValues = 1;

        const query = 'INSERT INTO stock (qty, itemid, branch_id, trndate, is_delete) VALUES (?, ?, ?, ?, ?)';
        const values = [grnqty, itemid, branch_id, trndate, defaultValues];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error(`Error inserting stock: ${error}`);
                callback(error, null);
                return;
            }
            const stockid = results.insertId;
            callback(null, stockid);
        });
    },

    deleteStock(stockId, value, callback) {
        const query = 'UPDATE stock SET is_delete = ? WHERE stockid = ?';
        const values = [value, stockId];

        connection.query(query, values, callback);
    },
    permanentDeleteStock(stockId, callback) {
        const query = 'DELETE FROM stock WHERE stockid = ?';
        const values = [stockId];

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

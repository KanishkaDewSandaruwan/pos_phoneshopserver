const { connection } = require('../../../config/connection');

const GrnModel = {
  getGrnById(grnId, callback) {
    connection.query('SELECT * FROM grn WHERE grnno = ? AND is_delete = 0', [grnId], callback);
  },

  getAllGrns(callback) {
    connection.query('SELECT * FROM grn WHERE is_delete = 0 AND status = 1', callback);
  },

  addGrn(grn, callback) {
    const { supplier_id, reference_number, branch_id } = grn;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;

    const query = 'INSERT INTO grn (supplier_id, reference_number, branch_id, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [supplier_id, reference_number, branch_id, defaultValues, trndate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const grnId = results.insertId;
      callback(null, grnId);
    });
  },

  updateGrn(grn, grnId, callback) {
    const { supplier_id, reference_number, branch_id, status } = grn;
    const query = 'UPDATE grn SET supplier_id = ?, reference_number = ?, branch_id = ?, status = ? WHERE grnno = ?';
    const values = [supplier_id, reference_number, branch_id, status, grnId];

    connection.query(query, values, callback);
  },

  updateGrnStatus(grnId, status, callback) {
    const query = 'UPDATE grn SET status = ? WHERE grnno = ?';
    const values = [status, grnId];

    connection.query(query, values, callback);
  },

  deleteGrn(grnId, value, callback) {
    const query = 'UPDATE grn SET is_delete = ? WHERE grnno = ?';
    const values = [value, grnId];

    connection.query(query, values, callback);
  },

  deleteGrns(grnIds, callback) {
    if (!Array.isArray(grnIds)) {
      grnIds = [grnIds]; // Convert to array if it's a single grn ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const grnId of grnIds) {
      GrnModel.getGrnById(grnId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          GrnModel.deleteGrn(grnId, 1, (deleteError, deleteResult) => {
            if (deleteError) {
              failCount++;
            } else {
              successCount++;
            }
  
            checkCompletion();
          });
        }
      });
    }
  
    function checkCompletion() {
      const totalCount = grnIds.length;
      if (successCount + failCount === totalCount) {
        if (typeof callback === 'function') { // Check if callback is provided and is a function
          callback(null, {
            totalCount,
            successCount,
            failCount,
          });
        }
      }
    }
  },

  permanentDeleteGrn(grnId, callback) {
    const query = 'DELETE FROM grn WHERE grnno = ?';
    const values = [grnId];

    connection.query(query, values, callback);
  },

  getGrnByIdPromise(grnId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM grn WHERE grnno = ?', [grnId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

const GrnTempModel = {
  getGrnTempById(grnTempId, callback) {
    connection.query('SELECT * FROM grn_temp WHERE grntempid = ? AND is_delete = 0', [grnTempId], callback);
  },

  getAllGrnTemp(callback) {
    connection.query('SELECT * FROM grn_temp WHERE is_delete = 0', callback);
  },

  addGrnTemp(grnTemp, callback) {
    const { itemid, sell_price, purchase_price, wholesale_price, discount, grnqty, branch_id, status } = grnTemp;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;

    const query = 'INSERT INTO grn_temp (itemid, sell_price, purchase_price, wholesale_price, discount, grnqty, branch_id, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [itemid, sell_price, purchase_price, wholesale_price, discount, grnqty, branch_id, status, trndate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const grnTempId = results.insertId;
      callback(null, grnTempId);
    });
  },

  updateGrnTemp(grnTemp, grnTempId, callback) {
    const { itemid, sell_price, purchase_price, wholesale_price, discount, grnqty, branch_id, status } = grnTemp;
    const query = 'UPDATE grn_temp SET itemid = ?, sell_price = ?, purchase_price = ?, wholesale_price = ?, discount = ?, grnqty = ?, branch_id = ?, status = ? WHERE grntempid = ?';
    const values = [itemid, sell_price, purchase_price, wholesale_price, discount, grnqty, branch_id, status, grnTempId];

    connection.query(query, values, callback);
  },

  updateGrnTempStatus(grnTempId, status, callback) {
    const query = 'UPDATE grn_temp SET status = ? WHERE grntempid = ?';
    const values = [status, grnTempId];

    connection.query(query, values, callback);
  },

  deleteGrnTemp(grnTempId, value, callback) {
    const query = 'UPDATE grn_temp SET is_delete = ? WHERE grntempid = ?';
    const values = [value, grnTempId];

    connection.query(query, values, callback);
  },

  deleteGrnTemps(grnTempIds, callback) {
    if (!Array.isArray(grnTempIds)) {
      grnTempIds = [grnTempIds]; // Convert to array if it's a single grnTemp ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const grnTempId of grnTempIds) {
      GrnTempModel.getGrnTempById(grnTempId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          GrnTempModel.deleteGrnTemp(grnTempId, 1, (deleteError, deleteResult) => {
            if (deleteError) {
              failCount++;
            } else {
              successCount++;
            }
  
            checkCompletion();
          });
        }
      });
    }
  
    function checkCompletion() {
      const totalCount = grnTempIds.length;
      if (successCount + failCount === totalCount) {
        if (typeof callback === 'function') { // Check if callback is provided and is a function
          callback(null, {
            totalCount,
            successCount,
            failCount,
          });
        }
      }
    }
  },

  permanentDeleteGrnTemp(grnTempId, callback) {
    const query = 'DELETE FROM grn_temp WHERE grntempid = ?';
    const values = [grnTempId];

    connection.query(query, values, callback);
  },

  getGrnTempByIdPromise(grnTempId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM grn_temp WHERE grntempid = ?', [grnTempId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = {
  GrnModel,
  GrnTempModel,
};

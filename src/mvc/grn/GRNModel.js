const { connection } = require('../../../config/connection');

const GrnModel = {
  getGrnById(grnId, callback) {
    connection.query('SELECT * FROM grn WHERE grnno = ? AND is_delete = 0', [grnId], callback);
  },

  getAllGrns(callback) {
    connection.query('SELECT * FROM grn WHERE is_delete = 0 AND status = 1', callback);
  },

  getAllGrnPayment(callback) {
    connection.query('SELECT * FROM grnpayment WHERE is_delete = 0 AND payment_status = 1', callback);
  },

  getAllGrnsbyBranch(branch_id,callback) {
    connection.query('SELECT * FROM grn WHERE is_delete = 0 AND status = 1 AND branch_id = ? ',[branch_id], callback);
  },

  getAllGrnPaymentbyGrnno(grnno,callback) {
    connection.query('SELECT * FROM grnpayment WHERE is_delete = 0 AND grnno = ? ',[grnno], callback);
  },

  addGrn(grn, callback) {
    const { supplier_id, reference_number, branch_id, user_id } = grn;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;


    const query = 'INSERT INTO grn (supplier_id, reference_number, branch_id, status, trndate, is_delete, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [supplier_id, reference_number, branch_id, activeValues, trndate, defaultValues, user_id];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const grnId = results.insertId;
      callback(null, grnId);

    });
  },

  addGrnPayment(totalpayment,grnno, callback) {
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues =1;
    const resiptNo=" ";


    const query = 'INSERT INTO grnpayment (total_amount, grnno, resiptNo, payment_status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [totalpayment,grnno,resiptNo, activeValues, trndate, defaultValues];
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      const grnpayment_id = results.insertId;
      callback(null, grnpayment_id);
    });
  },

  updateGrn(grn, grnId, callback) {
    const { supplier_id, reference_number, branch_id, status, user_id } = grn;
    const query = 'UPDATE grn SET supplier_id = ?, reference_number = ?, branch_id = ?, status = ?, user_id = ? WHERE grnno = ?';
    const values = [supplier_id, reference_number, branch_id, status, user_id, grnId];

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

  getStokebyItemidAndBranch(itemid, branch_id, callback) {
    connection.query('SELECT * FROM stock WHERE itemid = ? AND branch_id = ? AND is_delete = 0', [itemid, branch_id], callback);
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

  getAllGrnTempBYGRNNO(grnId, callback) {
    connection.query('SELECT * FROM grn_temp WHERE is_delete = 0 AND grnno = ? ', [grnId], callback);
  },

  getItemPriceBybranch(itemid, branch_id, callback) {
    connection.query('SELECT * FROM item_price WHERE itemId = ? AND branch_id = ? AND is_delete = 0', [itemid, branch_id], callback);
  },

  getItemBybranch(itemid, callback) {
    connection.query('SELECT * FROM item WHERE itemid = ? AND is_delete = 0', [itemid,], callback);
  },

  getAllGrnTempBygrnnoAndBranch(grnno, branch_id, callback) {
    connection.query(
      'SELECT * FROM grn_temp WHERE is_delete = 0 AND grnno = ? AND branch_id = ?',
      [grnno, branch_id],
      (error, results) => {
        if (error) {
          // Handle the database error by passing it to the callback
          callback(error, null);
        } else {
          // No error, pass the results to the callback
          callback(null, results);
        }
      }
    );
  },





  addGrnTemp(grnTemp, pricedetails, items, callback) {
    const { sell_price, purchase_price, wholesale_price, discount } = pricedetails;
    const { itemid, item_name, grnno, branch_id } = grnTemp;
    const { serial_status } = items;
    console.log(serial_status)
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;
    const grnqty = 0;

    const query = 'INSERT INTO grn_temp (itemid, sell_price, purchase_price, wholesale_price, discount, grnqty, branch_id, trndate, status, is_delete, item_name, grnno, temp_serial_status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [itemid, sell_price, purchase_price, wholesale_price, discount, grnqty, branch_id, trndate, activeValues, defaultValues, item_name, grnno, serial_status];

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

  updateGrnTempStatus(grnId, status, callback) {
    const query = 'UPDATE grn_temp SET status = ? WHERE grnno = ?';
    const values = [status, grnId];
 
    connection.query(query, values, callback);
  },

  updateGrnTempPurchaseprice(grntempid, purchase_price, callback) {
    const query = 'UPDATE grn_temp SET purchase_price = ? WHERE grntempid = ?';
    const values = [purchase_price, grntempid];
    connection.query(query, values, callback);
  },
  updateGrnTempSellPrice(grnTempId, sell_price, callback) {
    const query = 'UPDATE grn_temp SET sell_price = ? WHERE grntempid = ?';
    const values = [sell_price, grnTempId];
    connection.query(query, values, callback);
  },
  updateGrnTempWholesaleprice(grnTempId, wholesale_price, callback) {
    const query = 'UPDATE grn_temp SET wholesale_price = ? WHERE grntempid = ?';
    const values = [wholesale_price, grnTempId];
    connection.query(query, values, callback);
  },
  updateGrnTempGrnqty(grnTempId, grnqty, callback) {
    const query = 'UPDATE grn_temp SET grnqty = ? WHERE grntempid = ?';
    const values = [grnqty, grnTempId];
    connection.query(query, values, callback);
  },

  updateGrnTempDiscount(grnTempId, discount, callback) {
    const query = 'UPDATE grn_temp SET discount = ? WHERE grntempid = ?';
    const values = [discount, grnTempId];
    connection.query(query, values, callback);
  },

  deleteGrnTemp(grntempid, value, callback) {
    const query1 = 'UPDATE grn_temp SET is_delete = ? WHERE grntempid = ?';
    const values1 = [value, grntempid];

    //////

    connection.query(query1, values1, (error1) => {
      if (error1) {
          callback(error1, null);
          return;
      }

      const query2 = 'UPDATE temp_itemdetails SET is_delete = ? WHERE grntempid = ?';
        const values2 = [value, grntempid];
    
        connection.query(query2, values2, (error2) => {
            if (error2) {

                callback(error2, null);
                return;
            }
            
        callback();
        ;

    });

    });
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

  permanentDeleteGrnTemp(grntempid, callback) {
    const query1 = 'DELETE FROM `grn_temp` WHERE `grn_temp`.`grntempid` = ?';
    const values1 = [grntempid];

    connection.query(query1, values1, (error1) => {
      if (error1) {
          callback(error1, null);
          return;
      }

      const query2 = 'DELETE FROM `temp_itemdetails` WHERE `temp_itemdetails`.`grntempid` = ?';
        const values2 = [grntempid];
    
        connection.query(query2, values2, (error2) => {
            if (error2) {

                callback(error2, null);
                return;
            }

        callback();
        ;

    });

    });
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

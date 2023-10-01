const { connection } = require('../../../config/connection');

const TempItemDetailsModel = {

  getTempItemDetailsById(temp_itemdetails_id, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE temp_itemdetails_id = ? AND is_delete = 0', [temp_itemdetails_id], callback);
  },

  getTempItemDetailsBygrnTempId(grntempid, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE grntempid = ? AND is_delete = 0', [grntempid], callback);
  },

  getTempItemDetailsBySerial(serial_no, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE serial_no = ? AND is_delete = 0', [serial_no], callback);
  },

  getTempItemDetailsByEmi(emi_number, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE emi_number = ? AND is_delete = 0', [emi_number], callback);
  },

  getAllTempItemDetails(callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE is_delete = 0', callback);
  },

  getTempItemDetailsByBranchAngrntemp(grntempid, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE grntempid = ? AND is_delete = 0', [grntempid,], callback);
  },

  addTempItemDetails(grntempid, serial_no, colorid, callback) {
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;

    const query = 'INSERT INTO temp_itemdetails (grntempid, serial_no, colorid, trndate, is_delete) VALUES (?, ?, ?, ?, ?)';
    const values = [grntempid, serial_no, colorid, trndate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      // Assuming you want to return the insert ID
      const insertId = results.insertId;
      callback(null, insertId);
    });
  },

  updateTempItemDetails(tempitemdetails, temp_itemdetails_id, callback) {
    const { serial_no, emi_number, colorid } = tempitemdetails;
    const query = 'UPDATE temp_itemdetails SET serial_no = ?, emi_number = ?, colorid = ? WHERE temp_itemdetails_id = ?';
    const values = [serial_no, emi_number, colorid, temp_itemdetails_id];

    connection.query(query, values, callback);
  },

  deleteTempItemDetails(temp_itemdetails_id, value, callback) {
    const query = 'UPDATE temp_itemdetails SET is_delete = ? WHERE temp_itemdetails_id = ?';
    const values = [value, temp_itemdetails_id];

    connection.query(query, values, callback);
  },

  permenentdeleteTempItemDetails(temp_itemdetails_id, callback) {
    const query = 'DELETE FROM temp_itemdetails WHERE temp_itemdetails_id = ?';
    const values = [temp_itemdetails_id];

    connection.query(query, values, callback);
  },


};

const ItemDetailsModel = {

  getItemDetailsBySerial(serial_no, callback) {
    connection.query('SELECT * FROM itemdetails WHERE serial_no = ? AND is_delete = 0', [serial_no], callback);
  },

  getAllitemSerial(callback) {
    connection.query('SELECT * FROM itemdetails WHERE is_delete = 0', callback);
  },

  getAllItemDetailsBybranchAnditem(itemid, branch_id,callback) {
    connection.query('SELECT * FROM itemdetails WHERE is_delete = 0 AND itemid = ? AND branch_id = ?', [itemid, branch_id], callback);
  },

  addItemDetails(itemid, branch_id, serial_no, colorid, callback) {
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;

    const query = 'INSERT INTO itemdetails (itemid, branch_id, serial_no, colorid, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [itemid, branch_id, serial_no, colorid, trndate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      // Assuming you want to return the insert ID
      const insertId = results.insertId;
      callback(null, insertId);
    });
  },



};


module.exports = {
  TempItemDetailsModel,
  ItemDetailsModel,
};

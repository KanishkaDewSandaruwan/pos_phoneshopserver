const { connection } = require('../../../config/connection');

const SupplierModel = {
  getSupplierById(supplierId, callback) {
    connection.query('SELECT * FROM supplier WHERE supplier_id = ? AND is_delete = 0', [supplierId], callback);
  },

  getAllSuppliers(callback) {
    connection.query('SELECT * FROM supplier WHERE is_delete = 0', callback);
  },

  addSupplier(supplier, callback) {
    const { supplier_name, supplier_address, supplier_email, supplier_phone } = supplier;
    const supplier_adddate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 0;

    const query = 'INSERT INTO supplier (supplier_name, supplier_address, supplier_email, supplier_phone, supplier_adddate, supplier_status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [supplier_name, supplier_address, supplier_email, supplier_phone, supplier_adddate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const supplierId = results.insertId;
      callback(null, supplierId);
    });
  },

  updateSupplier(supplier, supplierId, callback) {
    const { supplier_name, supplier_address, supplier_phone, status } = supplier;
    const query = 'UPDATE supplier SET supplier_name = ?, supplier_address = ?, supplier_phone = ?, supplier_status = ? WHERE supplier_id = ?';
    const values = [supplier_name, supplier_address, supplier_phone, status, supplierId];

    connection.query(query, values, callback);
  },

  updateSupplierStatus(supplierId, status, callback) {
    const query = 'UPDATE supplier SET supplier_status = ? WHERE supplier_id = ?';
    const values = [status, supplierId];

    connection.query(query, values, callback);
  },

  deleteSupplier(supplierId, value, callback) {
    const query = 'UPDATE supplier SET is_delete = ? WHERE supplier_id = ?';
    const values = [value, supplierId];

    connection.query(query, values, callback);
  },

  permanentDeleteSupplier(supplierId, callback) {
    const query = 'DELETE FROM supplier WHERE supplier_id = ?';
    const values = [supplierId];

    connection.query(query, values, callback);
  },

  supplierById(supplierId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM supplier WHERE supplier_id = ?', [supplierId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = SupplierModel;

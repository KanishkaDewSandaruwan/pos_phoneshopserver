const { connection } = require('../../config/connection');

const SubcategoryModel = {
  getAllSubcategories(callback) {
    connection.query('SELECT * FROM subcategory WHERE is_delete = 0', callback);
  },

  getSubcategoryById(subcategoryId, callback) {
    connection.query('SELECT * FROM subcategory WHERE subcatid = ? AND is_delete = 0', [subcategoryId], callback);
  },

  addSubcategory(subcategory, callback) {
    const { subcat_name, catid, trndate, status, is_delete } = subcategory;

    const query = 'INSERT INTO subcategory (subcat_name, catid, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?)';
    const values = [subcat_name, catid, trndate, status, is_delete];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const subcategoryId = results.insertId;
      callback(null, subcategoryId);
    });
  },

  updateSubcategory(subcategory, subcategoryId, callback) {
    const { subcat_name, catid, trndate, status, is_delete } = subcategory;

    const query = 'UPDATE subcategory SET subcat_name = ?, catid = ?, trndate = ?, status = ?, is_delete = ? WHERE subcatid = ?';
    const values = [subcat_name, catid, trndate, status, is_delete, subcategoryId];

    connection.query(query, values, callback);
  },

  updateSubcategoryStatus(subcategoryId, status, callback) {
    const query = 'UPDATE subcategory SET status = ? WHERE subcatid = ?';
    const values = [status, subcategoryId];

    connection.query(query, values, callback);
  },

  deleteSubcategory(subcategoryId, is_delete, callback) {
    const query = 'UPDATE subcategory SET is_delete = ? WHERE subcatid = ?';
    const values = [is_delete, subcategoryId];

    connection.query(query, values, callback);
  },

  permanentDeleteSubcategory(subcategoryId, callback) {
    const query = 'DELETE FROM subcategory WHERE subcatid = ?';
    const values = [subcategoryId];

    connection.query(query, values, callback);
  },
};

module.exports = SubcategoryModel;

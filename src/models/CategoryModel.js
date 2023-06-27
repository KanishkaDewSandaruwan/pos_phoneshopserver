const { connection } = require('../../config/connection');

const CategoryModel = {
  getCategoryById(categoryId, callback) {
    connection.query('SELECT * FROM category WHERE catid = ? AND is_delete = 0', [categoryId], callback);
  },

  getAllCategories(callback) {
    connection.query('SELECT * FROM category WHERE is_delete = 0', callback);
  },

  addCategory(category, callback) {
    const { cat_name } = category;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 0;

    const query = 'INSERT INTO category (cat_name, trndate, status, is_delete) VALUES (?, ?, ?, ?)';
    const values = [cat_name, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const categoryId = results.insertId;
      callback(null, categoryId);
    });
  },

  updateCategory(category, categoryId, callback) {
    const { cat_name, status } = category;
    const query = 'UPDATE category SET cat_name = ?, status = ? WHERE catid = ?';
    const values = [cat_name, status ,categoryId];

    connection.query(query, values, callback);
  },

  updateCategoryStatus(categoryId, status, callback) {
    const query = 'UPDATE category SET status = ? WHERE catid = ?';
    const values = [status, categoryId];

    connection.query(query, values, callback);
  },

  deleteCategory(categoryId, value, callback) {
    const query = 'UPDATE category SET is_delete = ? WHERE catid = ?';
    const values = [value, categoryId];

    connection.query(query, values, callback);
  },

  permanentDeleteCategory(categoryId, callback) {
    const query = 'DELETE FROM category WHERE catid = ?';
    const values = [categoryId];

    connection.query(query, values, callback);
  },

  categoryById(categoryId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM category WHERE catid = ?', [categoryId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = CategoryModel;

const { connection } = require('../../../config/connection');

const ColorModel = {
  getColorById(colorId, callback) {
    connection.query('SELECT * FROM colors WHERE colorid = ? AND is_delete = 0', [colorId], callback);
  },

  getAllColors(callback) {
    connection.query('SELECT * FROM colors WHERE is_delete = 0', callback);
  },

  addColor(color, callback) {
    const { colorname, colorcode } = color;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 0;

    const query = 'INSERT INTO colors (colorname, colorcode, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?)';
    const values = [colorname, colorcode, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const colorId = results.insertId;
      callback(null, colorId);
    });
  },

  updateColor(color, colorId, callback) {
    const { colorname, colorcode, status } = color;
    const query = 'UPDATE colors SET colorname = ?, colorcode = ?, status = ? WHERE colorid = ?';
    const values = [colorname, colorcode, status, colorId];

    connection.query(query, values, callback);
  },

  updateColorStatus(colorId, status, callback) {
    const query = 'UPDATE colors SET status = ? WHERE colorid = ?';
    const values = [status, colorId];

    connection.query(query, values, callback);
  },

  deleteColor(colorId, value, callback) {
    const query = 'UPDATE colors SET is_delete = ? WHERE colorid = ?';
    const values = [value, colorId];

    connection.query(query, values, callback);
  },

  permanentDeleteColor(colorId, callback) {
    const query = 'DELETE FROM colors WHERE colorid = ?';
    const values = [colorId];

    connection.query(query, values, callback);
  },

  getColorByIdPromise(colorId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM colors WHERE colorid = ?', [colorId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = ColorModel;

const { connection } = require('../../../config/connection');

const ItemModel = {
  getAllItems(callback) {
    connection.query('SELECT * FROM item WHERE is_delete = 0', callback);
  },

  getItemById(itemId, callback) {
    connection.query('SELECT * FROM item WHERE itemid = ? AND is_delete = 0', [itemId], callback);
  },

  addItem(item, callback) {
    const { item_code, item_name, item_description, catid, item_serial, item_iminumber, item_color, item_brand, item_image, item_produce_date } = item;
    const adddate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 0;

    const query = 'INSERT INTO item (item_code, item_name, item_description, catid, item_serial, item_iminumber, item_color, item_brand, item_image, item_produce_date, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [item_code, item_name, item_description, catid, item_serial, item_iminumber, item_color, item_brand, item_image, item_produce_date, adddate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const itemId = results.insertId;
      callback(null, itemId);
    });
  },

  updateItem(item, itemId, callback) {
    const { item_code, item_name, item_description, catid, item_serial, item_iminumber, item_color, item_brand, item_image, item_produce_date, trndate, status, is_delete } = item;

    const query = 'UPDATE item SET item_code = ?, item_name = ?, item_description = ?, catid = ?, item_serial = ?, item_iminumber = ?, item_color = ?, item_brand = ?, item_image = ?, item_produce_date = ?, trndate = ?, status = ?, is_delete = ? WHERE itemid = ?';
    const values = [item_code, item_name, item_description, catid, item_serial, item_iminumber, item_color, item_brand, item_image, item_produce_date, trndate, status, is_delete, itemId];

    connection.query(query, values, callback);
  },

  deleteItem(itemId, is_delete, callback) {
    const query = 'UPDATE item SET is_delete = ? WHERE itemid = ?';
    const values = [is_delete, itemId];

    connection.query(query, values, callback);
  },
};

module.exports = ItemModel;

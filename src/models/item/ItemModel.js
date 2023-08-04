const { connection } = require('../../../config/connection');

const ItemModel = {
  getAllItems(callback) {
    connection.query('SELECT * FROM item JOIN category ON category.catid = item.catid JOIN subcategory ON subcategory.subcatid = item.subcatid JOIN colors ON colors.colorid = item.colorid JOIN brands ON brands.brandid = item.brandid WHERE item.is_delete = 0 ', callback);
  },

  getItemById(itemId, callback) {
    connection.query('SELECT * FROM item WHERE itemid = ? AND is_delete = 0', [itemId], callback);
  },

  getItemByName(item_name, callback) {
    connection.query('SELECT * FROM item WHERE item_name = ? AND is_delete = 0', [item_name], callback);
  },

  getItemByCode(item_code, callback) {
    connection.query('SELECT * FROM item WHERE item_code = ? AND is_delete = 0', [item_code], callback);
  },

  addItem(item, itemimage, callback) {
    const { item_code, item_name, item_description, catid, subcatid, colorid, brandid, serial} = item;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO item (item_code, item_name, item_description, catid, subcatid, colorid, brandid, serial_status, item_image, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)';
    const values = [item_code, item_name, item_description, catid, subcatid, colorid, brandid, serial, itemimage, trndate, activeValues, defaultValues];

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
    
    const { item_code, item_name, item_description, catid, subcatid, colorid, brandid,serial, status } = item;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const query = 'UPDATE item SET item_code = ?, item_name = ?, item_description = ?, catid = ?, subcatid = ?, colorid = ?, brandid = ?, serial_status = ?, status = ? WHERE itemid = ?';
    const values = [item_code, item_name, item_description, catid, subcatid, colorid, brandid, serial, status, itemId];
    connection.query(query, values, callback);
    
  },

  deleteItem(itemId, is_delete, callback) {
    const query = 'UPDATE item SET is_delete = ? WHERE itemid = ?';
    const values = [is_delete, itemId];

    connection.query(query, values, callback);
  },

  deleteItems(itemIds, callback) {
    if (!Array.isArray(itemIds)) {
      itemIds = [itemIds]; // Convert to array if it's a single user ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const itemId of itemIds) {
      ItemModel.getItemById(itemId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          ItemModel.getItemById(itemId, 1, (deleteError, deleteResult) => {
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
      const totalCount = itemIds.length;
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
  }
  
  ,

};

module.exports = ItemModel;

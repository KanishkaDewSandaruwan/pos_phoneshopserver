const { connection } = require('../../config/connection');

const ShopModel = {
  getShopById(shopId, callback) {
    connection.query('SELECT * FROM shop WHERE shopid = ? AND is_delete = 0', [shopId], callback);
  },

  getAllShops(callback) {
    connection.query('SELECT * FROM shop WHERE is_delete = 0', callback);
  },

  addShop(shop, callback) {
    const { shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo } = shop;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;

    const query = 'INSERT INTO shop (shopname, shopnphonenumber, address, email, website, facebook, instragram, whatsapp, logo, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo, trndate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const shopId = results.insertId;
      callback(null, shopId);
    });
  },

  updateShop(shop, shopId, callback) {
    const { shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo } = shop;
    const query = 'UPDATE shop SET shopname = ?, shopnphonenumber = ?, address = ?, email = ?, website = ?, facebook = ?, instragram = ?, whatsapp = ?, logo = ? WHERE shopid = ?';
    const values = [shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo, shopId];

    connection.query(query, values, callback);
  },

  deleteShop(shopId, value, callback) {
    const query = 'UPDATE shop SET is_delete = ? WHERE shopid = ?';
    const values = [value, shopId];

    connection.query(query, values, callback);
  },

  permanentDeleteShop(shopId, callback) {
    const query = 'DELETE FROM shop WHERE shopid = ?';
    const values = [shopId];

    connection.query(query, values, callback);
  },

  shopById(shopId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM shop WHERE shopid = ?', [shopId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = ShopModel;

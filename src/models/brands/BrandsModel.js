const { connection } = require('../../../config/connection');

const BrandModel = {
  getBrandById(brandId, callback) {
    connection.query('SELECT * FROM brands WHERE brandid = ? AND is_delete = 0', [brandId], callback);
  },

  getAllBrands(callback) {
    connection.query('SELECT * FROM brands WHERE is_delete = 0', callback);
  },

  addBrand(brand, callback) {
    const { brandname } = brand;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO brands (brandname, trndate, status, is_delete) VALUES (?, ?, ?, ?)';
    const values = [brandname, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const brandId = results.insertId;
      callback(null, brandId);
    });
  },

  updateBrand(brand, brandId, callback) {
    const { brandname, status } = brand;
    const query = 'UPDATE brands SET brandname = ?, status = ? WHERE brandid = ?';
    const values = [brandname, status, brandId];

    connection.query(query, values, callback);
  },

  updateBrandStatus(brandId, status, callback) {
    const query = 'UPDATE brands SET status = ? WHERE brandid = ?';
    const values = [status, brandId];

    connection.query(query, values, callback);
  },

  deleteBrand(brandId, value, callback) {
    const query = 'UPDATE brands SET is_delete = ? WHERE brandid = ?';
    const values = [value, brandId];

    connection.query(query, values, callback);
  },

  deleteBrands(brandIds, callback) {
    if (!Array.isArray(brandIds)) {
      brandIds = [brandIds]; // Convert to array if it's a single user ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const brandId of brandIds) {
      BrandModel.getBrandById(brandId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          BrandModel.deleteBrand(brandId, 1, (deleteError, deleteResult) => {
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
      const totalCount = brandIds.length;
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

  permanentDeleteBrand(brandId, callback) {
    const query = 'DELETE FROM brands WHERE brandid = ?';
    const values = [brandId];

    connection.query(query, values, callback);
  },

  getBrandByIdPromise(brandId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM brands WHERE brandid = ?', [brandId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = BrandModel;

const { connection } = require('../../../config/connection');


const TempposModel = {

    getAlldetailsToserialItems(serial_no, branch_id, callback) {
        connection.query('SELECT * FROM itemdetails INNER JOIN item ON itemdetails.itemid = item.itemid INNER JOIN item_price ON item.itemid = item_price.itemid INNER JOIN stock ON item_price.itemid = stock.itemid WHERE itemdetails.is_delete = 0 AND item.is_delete = 0 AND itemdetails.is_delete = 0 AND stock.is_delete = 0 AND itemdetails.serial_no = ? AND item_price.branch_id = ?', [serial_no, branch_id], callback);
    },

    getAlldetailsToNonserialItems(itemid, branch_id, callback) {
        connection.query('SELECT * FROM item_price INNER JOIN item ON item_price.itemid = item.itemid INNER JOIN stock ON item.itemid = stock.itemid WHERE item.is_delete = 0 AND stock.is_delete = 0 AND item.itemid = ? AND item_price.branch_id = ?', [itemid, branch_id], callback);
    },

    getallTempposbyBbrnch(branch_id,callback) {
        connection.query('SELECT * FROM pos_temp WHERE is_delete = 0 AND branch_id = ? ',[branch_id], callback);
      },

      getallTempposbyBbrnchAnduser( branch_id, userid, callback ) {
        connection.query('SELECT * FROM pos_temp WHERE is_delete = 0 AND branch_id = ? AND userid = ? ',[ branch_id, userid ], callback);
      },

      getTempposbyId(postempid,callback) {
        connection.query('SELECT * FROM pos_temp WHERE postempid = ? AND is_delete = 0',[postempid], callback);
      },
      searchByItemnNameOrCode(searchtext, branch_id, callback) {
        const searchTextWithWildcards = '%' + searchtext + '%';
        const query = `
          SELECT * 
          FROM item 
          INNER JOIN item_price ON item.itemid = item_price.itemid
          INNER JOIN stock ON item_price.itemid = stock.itemid
          WHERE (item.item_code LIKE ? OR item.item_name LIKE ?) AND item.is_delete = 0 AND item_price.branch_id = ? AND stock.branch_id = ?`;
      
        connection.query(query, [searchTextWithWildcards, searchTextWithWildcards, branch_id, branch_id], (error, results) => {
          if (error) {
            console.error('Error executing database query:', error);
            callback(error, null);
          } else {
            callback(null, results);
          }
        });
      },
      
      searchItemBySerial(searchtext, branch_id,callback) {
        connection.query('SELECT * FROM itemdetails INNER JOIN item_price ON itemdetails.itemid = item_price.itemid INNER JOIN item ON item_price.itemid = item.itemid INNER JOIN stock ON item.itemid = stock.itemid WHERE serial_no LIKE ? AND itemdetails.is_delete = 0 AND item_price.branch_id = ? AND stock.branch_id = ?',['%' + searchtext + '%', branch_id, branch_id], callback);
      },

      getallSerialsOfitem(itemid, branch_id,callback) {
        connection.query('SELECT * FROM itemdetails WHERE itemid = ? AND branch_id = ? AND is_delete = 0',[itemid, branch_id], callback);
      },

    addTemppos(details, userid, callback) {

        if (details.serial_no) {
           
        const { itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, branch_id} = details;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues =1;
        const defaultqty = 1;
       
    
        const query = 'INSERT INTO pos_temp (itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, qty, branch_id, userid, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, defaultqty, branch_id, userid, activeValues, trndate, defaultValues];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const postempid = results.insertId;
          callback(null, postempid);
    
        });

    } else {
    const { itemid, item_code, item_name, sell_price, wholesale_price, discount, branch_id } = details;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues =1;
        const defaultqty = 1;
        const serial_no = "";
       
    
        const query = 'INSERT INTO pos_temp (itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, qty, branch_id, userid, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, defaultqty, branch_id, userid, activeValues, trndate, defaultValues];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const postempid = results.insertId;
          callback(null, postempid);
    
        });
      }

      },

      updateTempposqty(postempid, qty, callback) {
        const query = 'UPDATE pos_temp SET qty = ? WHERE postempid = ?';
        const values = [qty, postempid];
        connection.query(query, values, callback); 
      },

      deleteTemppos(postempid, callback) {
        const query = 'DELETE FROM pos_temp WHERE postempid = ?';
        const values = [postempid];
    
        connection.query(query, values, callback);
      },
};

const posModel = {

      addSalesItem(details, salesid, callback) {

          
        const { itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, branch_id, userid, qty} = details;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues =1;
        
        
      

        const query = 'INSERT INTO sales_item (itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, qty, branch_id, userid, salesid, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [itemid, item_code, item_name, serial_no, sell_price, wholesale_price, discount, qty, branch_id, userid, salesid, activeValues, trndate, defaultValues];

        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }

          const sales_item_id = results.insertId;
          callback(null, sales_item_id);

        });

    },

      addSales(salesdetails, userid, branch_id, callback) {

            
        const { sub_total, discount_total, net_total, cash_amount, card_amount, sales_type, customer_id } = salesdetails;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues =1;
        
      

        const query = 'INSERT INTO sales (sub_total, discount_total, net_total, cash_amount, card_amount, sales_type, branch_id, userid, customer_id, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [sub_total, discount_total, net_total, cash_amount, card_amount, sales_type, branch_id, userid, customer_id, activeValues, trndate, defaultValues];

        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }

          const salesid = results.insertId;
          callback(null, salesid);

        });

      },


};

module.exports = {
    posModel,
    TempposModel
  };
const {posModel, TempposModel } = require('./posModel');
const StockModel = require('../stock/StockModel');
const SearchView  = require('./searchView');

//POS sales part

const finishSales = (req, res) => {
  const { branch_id,userid } = req.params;
  const salesdetails = req.body;
  let hasError = false


  TempposModel.getallTempposbyBbrnchAnduser( branch_id, userid, (error, postempdetails) => {
    if (error) {
      console.error(`Error fetching postempdetails: ${error}`);
      res.status(500).send({ error: "Failed to fetch postempdetails" });
      hasError = true; // Set the flag to true
      return;
    }
    if (!postempdetails || postempdetails.length === 0) {
      res.status(404).send({ error: "postempdetails not found" });
      hasError = true; // Set the flag to true
      return;
    }

    let processedCount = 0;
    const totalCount = postempdetails.length;

      const sendFailResponse = () => {
        res.status(500).send({ message: "sales save failed" });
      };

      const sendSuccessResponse = () => {

        if (processedCount === totalCount) {
          if (hasError) {
            sendFailResponse();
          } else {

            res.status(200).send({ message: 'sales save Success' });

          }
        };
      };

      posModel.addSales(salesdetails, userid, branch_id, (error, salesid) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database for add temp',error });
          return;
        }
    
        if (!salesid) {
          res.status(404).send({ error: 'Failed to create temp pos' });
          return;
    
        }
    

      


      
      let successCount = 0;
      let failCount = 0;
      const insertIds = []; // Store inserted IDs

      for (const detail of postempdetails) {

        posModel.addSalesItem( detail,salesid, (insertError, insertId) => {
          if (insertError) {
            console.error(`Error inserting sales item: ${insertError}`);
            failCount++;
            processedCount++;
          } else {
            successCount++;
            processedCount++;
            insertIds.push(insertId);
            //console.log(`itemdetails added successfully`);
          }


          // Check if all items have been processed
          if (successCount + failCount === postempdetails.length) {
            console.log(`total count:${totalCount},successCount:${successCount},failCount:${failCount},insertIds:${insertIds}`);
          sendSuccessResponse();

          }
        });

        // Check if all items have been processed
        if (successCount + failCount === postempdetails.length) {
          console.log(`total count:${totalCount},successCount:${successCount},failCount:${failCount},insertIds:${insertIds}`);
          sendSuccessResponse();


        }

      }

    });

  });
};



//POS temp cart controlers

const addTempPosbySerial = (req, res) => {
    const { serial_no, branch_id, userid } = req.params;
    console.log(userid);

    TempposModel.getAlldetailsToserialItems(serial_no, branch_id, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
        }
    
        if (results.length === 0) {
          res.status(404).send({ error: 'details not found' });
          return;
        }
    
        const details = results[0];
        //console.log(details.qty);

        if (details.qty<1) {
            res.send({error:'Can Not add this item : 0 qty in stock'});
            return;
          }

        TempposModel.addTemppos(details, userid, (error, postempid) => {
            if (error) {
              res.status(500).send({ error: 'Error fetching data from the database for add temp',error });
              return;
            }
        
            if (!postempid) {
              res.status(404).send({ error: 'Failed to create temp pos' });
              return;
        
            }
        
            res.status(200).send({ message: 'temp pos created successfully', postempid });
          });

      });
  
  };

  const addTempPosbyitemId = (req, res) => {
    const { itemid, branch_id, userid } = req.params;

    TempposModel.getAlldetailsToNonserialItems(itemid, branch_id, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
        }
    
        if (results.length === 0) {
          res.status(404).send({ error: 'details not found' });
          return;
        }
    
        const details = results[0];
        //console.log(details.qty);

        if (details.qty<1) {
            res.send({error:'Can Not add this item : 0 qty in stock'});
            return;
          }

        TempposModel.addTemppos(details, userid, (error, postempid) => {
            if (error) {
              res.status(500).send({ error: 'Error fetching data from the database for add temp',error });
              return;
            }
        
            if (!postempid) {
              res.status(404).send({ error: 'Failed to create temp pos' });
              return;
        
            }
        
            res.status(200).send({ message: 'temp pos created successfully', postempid });
          });

      });
  
  };


  const getallTempposbyBbrnch = (req, res) => {
    const { branch_id } = req.params;
    TempposModel.getallTempposbyBbrnch(branch_id, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'Temppos not found' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

  const searchByItemnNameOrCodeorSerial = (req, res) => {
    const { searchtext, branch_id } = req.params;
  
    TempposModel.searchItemBySerial(searchtext, branch_id, (error, results1) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (Array.isArray(results1) && results1.length > 0) {
        const modifiedSearchItemsArray = SearchView.renderSearchItemsArray(results1);
        res.status(200).send(modifiedSearchItemsArray);
    } else {
        TempposModel.searchByItemnNameOrCode(searchtext, branch_id, (error, results2) => {
          if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
          }
  
          if (Array.isArray(results2) && results2.length > 0) {
            const modifiedSearchItemsArray = SearchView.renderSearchItemsArray(results2);
            res.status(200).send(modifiedSearchItemsArray);
        } else {
            // Handle empty results case
            res.status(404).send({ message: "item not found" });
        }

        });
      }
    });
  };
  
  const getallSerialsOfitem = (req, res) => {
    const { itemid, branch_id } = req.params;
    TempposModel.getallSerialsOfitem(itemid, branch_id, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'Serial not found' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

  const updateTempposqty = (req, res) => {
    const { postempid, qty} = req.params;
  
    TempposModel.getTempposbyId(postempid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'Temppos not found' });
        return;
      }
      const stock = results[0];
      

      StockModel.getStockByItemAndBranch(stock.itemid, stock.branch_id, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
        }
    
        if (results.length === 0) {
          res.status(404).send({ error: 'stock not found' });
          return;
        }

        const instoke = results[0];


        if (instoke.qty<qty) {
            res.send({ error: `only have ${instoke.qty} qty in stokes` });
            return;
          }
      
  
      TempposModel.updateTempposqty(postempid, qty, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error updating Qty in the database' });
          return;
        }
  
        res.status(200).send({ message: 'Qty updated successfully' });
      });
    });

    });
  };

  const deleteTemppos = (req, res) => {
    const { postempid } = req.params;
  
    TempposModel.getTempposbyId(postempid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'Temppos not found' });
        return;
      }
  
      TempposModel.deleteTemppos(postempid, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error  deletion in the database' });
          return;
        }
  
        res.status(200).send({ message: 'deleted successfully' });
      });
    });
  };




module.exports = {
    addTempPosbySerial,
    getallTempposbyBbrnch,
    updateTempposqty,
    deleteTemppos,
    searchByItemnNameOrCodeorSerial,
    getallSerialsOfitem,
    addTempPosbySerial,
    addTempPosbyitemId,

    finishSales

}
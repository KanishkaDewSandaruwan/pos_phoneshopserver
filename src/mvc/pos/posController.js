const {posModel, TempposModel } = require('./posModel');
const StockModel = require('../stock/StockModel');


const addTempPosbySerial = (req, res) => {
    const { serial_no, branch_id, userid } = req.params;

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

        TempposModel.addTemppos(details, (error, postempid) => {
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
    const { itemid, branch_id } = req.params;

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

        TempposModel.addTemppos(details, (error, postempid) => {
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
    const { searchtext } = req.params;
  
    TempposModel.searchItemBySerial(searchtext, (error, results1) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results1.length > 0) {
        res.status(200).send(results1);
      } else {
        TempposModel.searchByItemnNameOrCode(searchtext, (error, results2) => {
          if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
          }
  
          if (results2.length === 0) {
            res.status(404).send({ error: 'Item not found' });
          } else {
            res.status(200).send(results2);
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
    addTempPosbyitemId

}
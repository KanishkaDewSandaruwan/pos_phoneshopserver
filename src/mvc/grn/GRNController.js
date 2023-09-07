const express = require('express');
const {
  GrnModel,
  GrnTempModel
} = require('./GRNModel');

const {TempItemDetailsModel,ItemDetailsModel} = require('./ItemDetailsModel');

const StockModel = require('../stock/StockModel');
const ItemModel = require('../item/ItemModel');

const finishGrn = async (req, res) => {
  const { grnno, branch_id } = req.params;
  let hasError = false;

  GrnTempModel.getAllGrnTempBygrnnoAndBranch(grnno, branch_id, (error, grntempdetails) => {
    if (error) {
      console.error(`Error fetching grntempdetails: ${error}`);
      res.status(500).send({ error: 'Failed to fetch grntempdetails' });
      hasError = true; // Set the flag to true
      return;
    }
    if (!grntempdetails || grntempdetails.length === 0) {
      res.status(404).send({ error: 'Grn temp not found' });
      hasError = true; // Set the flag to true
      return;
    }

    let processedCount = 0;
    const totalCount = grntempdetails.length;

    const sendFailResponse = () => {
      res.status(500).send({ message: 'Grn save failed' });
    };

    const sendSuccessResponse = () => {
      if (processedCount === totalCount) {
        if (hasError) {
          sendFailResponse();
        } else {
          res.status(200).send({ message: 'Grn save Success' });
        }
      }
    };

    for (const detail of grntempdetails) {
      const itemid = detail.itemid;

      StockModel.getStockByItemAndBranch(itemid, branch_id, (error, results) => {
        if (error) {
          console.error(`Error fetching data from the database: ${error}`);
          hasError = true; // Set the flag to true
          processedCount++;
          sendFailResponse();
          return;
        }

        if (results.length > 0) {
          StockModel.updateDetailsInStock(detail.grnqty, itemid, branch_id, (error, grnId) => {
            if (error) {
              console.error(`Error updating stock: ${error}`);
              hasError = true; // Set the flag to true
            }
            processedCount++;
            sendSuccessResponse();
          });
        } else {
          StockModel.addnewStokes(detail.grnqty, itemid, branch_id, (error, stockid) => {
            if (error) {
              console.error(`Error adding new stock: ${error}`);
              hasError = true; // Set the flag to true
            }
            console.log('stockid', stockid);
            processedCount++;
            sendSuccessResponse();
          });
        }
      });

      // update Item Price
      ItemModel.getPriceBybranchId(itemid, branch_id, (error, results) => {
        if (error) {
          console.error(`Error fetching data from the database: ${error}`);
          hasError = true; // Set the flag to true
          processedCount++;
          sendFailResponse();
          return;
        }

        if (results.length > 0) {
          ItemModel.updateItemPrices(itemid, detail.sell_price, detail.purchase_price, detail.wholesale_price, detail.discount, branch_id, (error, grnId) => {
            if (error) {
              console.error(`Error updating item prices: ${error}`);
              hasError = true; // Set the flag to true
            }
            processedCount++;
            sendSuccessResponse();
          });
        } else {
          const itemPrice = { 
            itemid: itemid, 
            sell_price: detail.sell_price, 
            purchase_price: detail.purchase_price, 
            wholesale_price: detail.wholesale_price, 
            discount: detail.discount, 
            branch_id: branch_id
          };

          ItemModel.addNewitemPrice(itemPrice, (error, itempriceId) => {
            if (error) {
              console.error(`Error adding new item price: ${error}`);
              hasError = true; // Set the flag to true
            }
            console.log('itempriceId', itempriceId);
            processedCount++;
            sendSuccessResponse();
          });
        }
      });
      /////add temp item details to itemdetails
      let successCount = 0;
  let failCount = 0;
  const failedSerials = []; // Store failed serial numbers
  const insertIds = []; // Store inserted IDs

  TempItemDetailsModel.getTempItemDetailsByBranchAngrntemp(detail.grntempid, (error, tempitemdetails) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (tempitemdetails.length === 0) {
      res.status(404).send({ error: 'TempItemDetails not found' });
      return;
    }
    

    for (const tempitemdetail of tempitemdetails) {
      const { serial_no, colorid } = tempitemdetail;
  
      ItemDetailsModel.getItemDetailsBySerial(serial_no, (error, results) => {
        if (error) {
          console.error(`Error fetching itemdetails: ${error}`);
          failCount++;
        } else if (results.length > 0) {
          // Serial number already exists
          failedSerials.push(serial_no);
          failCount++;
          console.log(`Serial number already exists: ${serial_no}`);
          hasError = true;
        } else {
          ItemDetailsModel.addItemDetails(itemid, serial_no, colorid, (insertError, insertId) => {
            if (insertError) {
              console.error(`Error inserting itemdetails: ${insertError}`);
              failCount++;
            } else {
              successCount++;
              insertIds.push(insertId);
              //console.log(`itemdetails added successfully`);
            }
  
            // Check if all items have been processed
            if (successCount + failCount === tempitemdetails.length) {
              const totalCount = tempitemdetails.length;
              console.log(`total count:${totalCount},successCount:${successCount},failCountfailCount:${failedSerials},insertIds:${insertIds}`);
              processedCount++;
            sendSuccessResponse();

            }
          });
        }
  
        // Check if all items have been processed
        if (successCount + failCount === tempitemdetails.length) {
          const totalCount = tempitemdetails.length;
          console.log(`total count:${totalCount},successCount:${successCount},failCountfailCount:${failedSerials},insertIds:${insertIds}`);
          processedCount++;
          sendSuccessResponse();
            

        }
      });
    }
  });

    }
  });
};




// Controller functions for Grn Model
const getAllGrns = (req, res) => {
  GrnModel.getAllGrns((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getGrnById = (req, res) => {
  const { grnId } = req.params;
  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addGrn = (req, res) => {
  const grn = req.body;

  GrnModel.addGrn(grn, (error, grnId) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!grnId) {
      res.status(404).send({ error: 'Failed to create grn' });
      return;

    }

    res.status(200).send({ message: 'Grn created successfully', grnId });
  });
};

const updateGrn = (req, res) => {
  const { grnId } = req.params;
  const grn = req.body;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    GrnModel.updateGrn(grn, grnId, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: 'Grn not found or no changes made' });
        return;
      }

      res.status(200).send({ message: 'Grn updated successfully' });
    });
  });
};

const updateGrnStatus = (req, res) => {
  const { grnId } = req.params;
  const { status } = req.body;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    GrnModel.updateGrnStatus(grnId, status, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Status updated successfully' });
    });
  });
};

const deleteGrn = (req, res) => {
  const { grnId } = req.params;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    GrnModel.deleteGrn(grnId, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'Grn deleted successfully' });
    });
  });
};

const deleteGrns = (req, res) => {
  const { grnIds } = req.body;

  if (!Array.isArray(grnIds) || grnIds.length === 0) {
    res.status(400).send({ error: 'Invalid grn IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const grnId of grnIds) {
    GrnModel.getGrnById(grnId, (error, results) => {
      if (error) {
        console.error(`Error fetching grn with ID ${grnId}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`Grn with ID ${grnId} not found`);
        failCount++;
      } else {
        GrnModel.deleteGrn(grnId, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting grn with ID ${grnId}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`Grn with ID ${grnId} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === grnIds.length) {
            const totalCount = grnIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all grns have been processed
      if (successCount + failCount === grnIds.length) {
        const totalCount = grnIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteGrn = (req, res) => {
  const { grnId } = req.params;

  GrnModel.permanentDeleteGrn(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting grn from the database' });
      return;
    }

    res.status(200).send({ message: 'Grn permanently deleted successfully' });
  });
};

// Controller functions for GrnTemp Model//////////////////////////////////////////
const getAllGrnTemp = (req, res) => {
  GrnTempModel.getAllGrnTemp((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getAllGrnTempBYGRNNO = (req, res) => {
  const { grnId } = req.params;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GRN not found' });
      return;
    }
    GrnTempModel.getAllGrnTempBYGRNNO(grnId, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      res.status(200).send(results);
    });
  });
};

const getGrnTempById = (req, res) => {
  const { grnTempId } = req.params;
  GrnTempModel.getGrnTempById(grnTempId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addGrnTemp = (req, res) => {
  const grnTemp = req.body;

  GrnTempModel.getItemBybranch(grnTemp.itemid, grnTemp.branch_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }
    
    // Check the condition and proceed with your code
    if (results.length === 0) {
    // Define and initialize pricedetails with default values
    const zeropricedetails = {
      sell_price: 0,
      purchase_price: 0,
      wholesale_price: 0,
      discount: 0,
    };
      GrnTempModel.addGrnTempwithoutprice(grnTemp, zeropricedetails, (error, grnTempId) => {
        if (error) {
          res.status(500).send({ error: 'Error inserting data into the database' });
          return;
        }
    
        if (!grnTempId) {
          res.status(404).send({ error: 'Failed to create grnTemp' });
          return;
        }
    
        res.status(200).send({ message: 'GrnTemp created successfully', grnTempId });
      });
    }
    
    if (results.length > 0) {
      
    const pricedetails = results[0];

    GrnTempModel.addGrnTempwithprice(grnTemp, pricedetails, (error, grnTempId) => {
      if (error) {
        res.status(500).send({ error: 'Error inserting data into the database' });
        return;
      }

      if (!grnTempId) {
        res.status(404).send({ error: 'Failed to create grnTemp' });
        return;
      }

      res.status(200).send({ message: 'GrnTemp created successfully', grnTempId });
    });
  }
  });
};

const updateGrnTemp = (req, res) => {
  const { grnTempId } = req.params;
  const grnTemp = req.body;

  GrnTempModel.getGrnTempById(grnTempId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTemp(grnTemp, grnTempId, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: 'GrnTemp not found or no changes made' });
        return;
      }

      res.status(200).send({ message: 'GrnTemp updated successfully' });
    });
  });
};

const updateGrnTempPurchaseprice = (req, res) => {
  const { grntempid } = req.params;
  const { purchase_price } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempPurchaseprice(grntempid, purchase_price, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Purchase Price updated successfully' });
    });
  });
};

const updateGrnTempSellPrice = (req, res) => {
  const { grntempid } = req.params;
  const { sell_price } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempSellPrice(grntempid, sell_price, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Sell Price updated successfully' });
    });
  });
};

const updateGrnTempWholesaleprice = (req, res) => {
  const { grntempid } = req.params;
  const { wholesale_price } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempWholesaleprice(grntempid, wholesale_price, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'wholesale price updated successfully' });
    });
  });
};

const updateGrnTempGrnqty = (req, res) => {
  const { grntempid } = req.params;
  const { grnqty } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempGrnqty(grntempid, grnqty, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Qty updated successfully' });
    });
  });
};

const updateGrnTempDiscount = (req, res) => {
  const { grntempid } = req.params;
  const { discount } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempDiscount(grntempid, discount, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Discount updated successfully' });
    });
  });
};

const deleteGrnTemp = (req, res) => {
  const { grntempid } = req.params;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.deleteGrnTemp(grntempid, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'GrnTemp deleted successfully' });
    });
  });
};

const deleteGrnTemps = (req, res) => {
  const { grntempids } = req.body;

  if (!Array.isArray(grntempids) || grntempids.length === 0) {
    res.status(400).send({ error: 'Invalid grnTemp IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const grntempid of grntempids) {
    GrnTempModel.getGrnTempById(grntempid, (error, results) => {
      if (error) {
        console.error(`Error fetching grnTemp with ID ${grntempid}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`GrnTemp with ID ${grntempid} not found`);
        failCount++;
      } else {
        GrnTempModel.deleteGrnTemp(grntempid, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting grnTemp with ID ${grntempid}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`GrnTemp with ID ${grntempid} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === grntempids.length) {
            const totalCount = grntempids.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all grnTemps have been processed
      if (successCount + failCount === grntempids.length) {
        const totalCount = grntempids.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteGrnTemp = (req, res) => {
  const { grntempid } = req.params;


  GrnTempModel.permanentDeleteGrnTemp(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting grnTemp from the database' });
      return;
    }

    res.status(200).send({ message: 'GrnTemp permanently deleted successfully' });
  });
};

module.exports = {
  // Grn Model
  getAllGrns,
  getGrnById,
  addGrn,
  updateGrn,
  updateGrnStatus,
  deleteGrn,
  permanentDeleteGrn,
  deleteGrns,

  // GrnTemp Model
  getAllGrnTemp,
  getGrnTempById,
  addGrnTemp,
  updateGrnTemp,
  updateGrnTempPurchaseprice,
  updateGrnTempSellPrice,
  updateGrnTempWholesaleprice,
  updateGrnTempGrnqty,
  updateGrnTempDiscount,
  deleteGrnTemp,
  permanentDeleteGrnTemp,
  deleteGrnTemps,
  getAllGrnTempBYGRNNO,
  addGrnTemp,
  finishGrn
};

const express = require('express');
const {TempItemDetailsModel,ItemDetailsModel} = require('./ItemDetailsModel');

//item details part

const getAllitemSerial = (req, res) => {
  ItemDetailsModel.getAllitemSerial((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};
//get all item details for admin
const getAllItemDetailsBybranchAnditem = (req, res) => {

  const { itemid, branch_id } = req.params;
  ItemDetailsModel.getAllItemDetailsBybranchAnditem(itemid,branch_id,(error, results) => {

    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }
    if (results.length === 0) {
      res.status(404).send({ error: 'TempItemDetails not found' });
      return;
    }

    res.status(200).send(results);
  });
};

//temp item details part

const getAllTempItemDetails = (req, res) => {
  TempItemDetailsModel.getAllTempItemDetails((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }
    if (results.length === 0) {
      res.status(404).send({ error: 'TempItemDetails not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const getTempItemDetailsById = (req, res) => {
  const { temp_itemdetails_id } = req.params;
  TempItemDetailsModel.getTempItemDetailsById(temp_itemdetails_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'TempItemDetails not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const getTempItemDetailsBygrnTempId = (req, res) => {
  const { grntempid } = req.params;
  TempItemDetailsModel.getTempItemDetailsBygrnTempId(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'TempItemDetails not found' });
      return;
    }

    res.status(200).send(results);
  });
};


const addTempItemDetails = async (req, res) => {
  const tempitemdetails = req.body;
  let successCount = 0;
  let failCount = 0;
  const failedSerials = []; // Store failed serial numbers
  const insertIds = []; // Store inserted IDs

  for (const detail of tempitemdetails) {
    const { grntempid, serial_no, colorid } = detail;

    TempItemDetailsModel.getTempItemDetailsBySerial(serial_no, (error, results) => {
      if (error) {
        console.error(`Error fetching tempitemdetails: ${error}`);
        failCount++;
      } else if (results.length > 0) {
        // Serial number already exists
        failedSerials.push(serial_no);
        failCount++;
        console.log(`Serial number already exists: ${serial_no}`);
      } else {
        TempItemDetailsModel.addTempItemDetails(grntempid, serial_no, colorid, (insertError, insertId) => {
          if (insertError) {
            console.error(`Error inserting tempitemdetails: ${insertError}`);
            failCount++;
            
          } else {
            successCount++;
            insertIds.push(insertId);
            console.log(`Tempitemdetails added successfully`);
          }

          // Check if all items have been processed
          if (successCount + failCount === tempitemdetails.length) {
            const totalCount = tempitemdetails.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
              failedSerials,
              insertIds,
            });
          }
        });
      }

      // Check if all items have been processed
      if (successCount + failCount === tempitemdetails.length) {
        const totalCount = tempitemdetails.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
          failedSerials,
          insertIds,
        });
      }
    });
  }
};


const updateTempItemDetails = (req, res) => {
  const { temp_itemdetails_id } = req.params;
  const tempitemdetails = req.body;

  TempItemDetailsModel.getTempItemDetailsById(temp_itemdetails_id, (error, existingtempitemdetails) => {
    if (error) {
      return res.status(500).send({ error: 'Error fetching data from the database' });
    }

    if (!existingtempitemdetails[0]) {
      return res.status(404).send({ error: 'tempitemdetails not found' });
    }

    if (tempitemdetails.serial_no && tempitemdetails.serial_no !== existingtempitemdetails[0].serial_no) {
      TempItemDetailsModel.getTempItemDetailsBySerial(tempitemdetails.serial_no, (serialError, serialResults) => {
        if (serialError) {
          return res.status(500).send({ error: 'Error fetching data from the database' });
        }

        if (serialResults.length > 0) {
          return res.status(409).send({ error: 'this serial is already exists' });
        }

        checkEmiNumber();
      });
    } else {
      checkEmiNumber();
    }

    function checkEmiNumber() {
      if (tempitemdetails.emi_number && tempitemdetails.emi_number !== existingtempitemdetails[0].emi_number) {
        TempItemDetailsModel.getTempItemDetailsByEmi(tempitemdetails.emi_number, (emiError, emiResults) => {
          if (emiError) {
            return res.status(500).send({ error: 'Error fetching data from the database' });
          }

          if (emiResults.length > 0) {
            return res.status(409).send({ error: 'this emi_number is already exists' });
          }

          updateExistingtempitemdetails();
        });
      } else {
        updateExistingtempitemdetails();
      }
    }

    function updateExistingtempitemdetails() {
      TempItemDetailsModel.updateTempItemDetails(tempitemdetails, temp_itemdetails_id, (updateError, results) => {
        if (updateError) {
          return res.status(500).send({ error: 'Error updating tempitemdetails in the database' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).send({ error: 'tempitemdetails not found or no changes made' });
        }

        res.status(200).send({ message: 'tempitemdetails updated successfully' });
      });
    }
  });
};

const deleteTempItemDetails = (req, res) => {
  const { temp_itemdetails_id } = req.params;

  TempItemDetailsModel.getTempItemDetailsById(temp_itemdetails_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'tempitemdetails not found' });
      return;
    }

    TempItemDetailsModel.deleteTempItemDetails(temp_itemdetails_id, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'tempitemdetails deleted successfully' });
    });
  });
};

const permenentdeleteTempItemDetails = (req, res) => {
  const { temp_itemdetails_id } = req.params;

  TempItemDetailsModel.getTempItemDetailsById(temp_itemdetails_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'tempitemdetails not found' });
      return;
    }

    TempItemDetailsModel.permenentdeleteTempItemDetails(temp_itemdetails_id, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error permenent deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'tempitemdetails permenent deleted successfully' });
    });
  });
};

const deletemultipleTempItemDetails = (req, res) => {
  const { temp_itemdetails_ids } = req.body;

  if (!Array.isArray(temp_itemdetails_ids) || temp_itemdetails_ids.length === 0) {
    res.status(400).send({ error: 'Invalid tempitemdetails IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const temp_itemdetails_id of temp_itemdetails_ids) {
    TempItemDetailsModel.getTempItemDetailsById(temp_itemdetails_id, (error, results) => {
      if (error) {
        console.error(`Error fetching tempitemdetails with ID ${temp_itemdetails_id}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`tempitemdetails with ID ${temp_itemdetails_id} not found`);
        failCount++;
      } else {
        TempItemDetailsModel.deleteTempItemDetails(temp_itemdetails_id, 1, (deleteError, deleteResult) => {
          console.log('cscs');
          if (deleteError) {
            console.error(`Error deleting tempitemdetails with ID ${temp_itemdetails_id}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`tempitemdetails with ID ${temp_itemdetails_id} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === temp_itemdetails_ids.length) {
            const totalCount = temp_itemdetails_ids.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all colors have been processed
      if (successCount + failCount === temp_itemdetails_ids.length) {
        const totalCount = temp_itemdetails_ids.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};
const permenentdeletemultipleTempItemDetails = (req, res) => {
  const { temp_itemdetails_ids } = req.body;

  if (!Array.isArray(temp_itemdetails_ids) || temp_itemdetails_ids.length === 0) {
    res.status(400).send({ error: 'Invalid tempitemdetails IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const temp_itemdetails_id of temp_itemdetails_ids) {
    TempItemDetailsModel.getTempItemDetailsById(temp_itemdetails_id, (error, results) => {
      if (error) {
        console.error(`Error fetching tempitemdetails with ID ${temp_itemdetails_id}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`tempitemdetails with ID ${temp_itemdetails_id} not found`);
        failCount++;
      } else {
        TempItemDetailsModel.permenentdeleteTempItemDetails(temp_itemdetails_id, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting tempitemdetails with ID ${temp_itemdetails_id}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`tempitemdetails with ID ${temp_itemdetails_id} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === temp_itemdetails_ids.length) {
            const totalCount = temp_itemdetails_ids.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all colors have been processed
      if (successCount + failCount === temp_itemdetails_ids.length) {
        const totalCount = temp_itemdetails_ids.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

  
module.exports = {
  getAllTempItemDetails,
  getTempItemDetailsById,
  getTempItemDetailsBygrnTempId,
  addTempItemDetails,
  updateTempItemDetails,
  deleteTempItemDetails,
  permenentdeleteTempItemDetails,
  deletemultipleTempItemDetails,
  permenentdeletemultipleTempItemDetails,
  getAllitemSerial,
  getAllItemDetailsBybranchAnditem


};
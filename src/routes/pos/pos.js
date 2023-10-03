const express = require('express');

const {
    addTempPosbySerial,
    getallTempposbyBbrnch,
    updateTempposqty,
    deleteTemppos,
    searchByItemnNameOrCodeorSerial,
    getallSerialsOfitem,
    addTempPosbyitemId,

    finishSales

  } = require('../../mvc/pos/posController');
  
  const { authenticateToken } = require('../../middlewares/userAuth');
  const { authorizeAccessControll } = require('../../middlewares/userAccess');

  module.exports = (config) => {
    const router = express.Router();


    // Routes for Temppos

  router.post('/createwithSerial/:serial_no/:branch_id/:userid', authenticateToken, addTempPosbySerial);
  router.post('/createwithNonSerial/:itemid/:branch_id/:userid', authenticateToken, addTempPosbyitemId);
  router.get('/alltemposbyBranch/:branch_id', authenticateToken, getallTempposbyBbrnch);
  router.get('/serials/:itemid/:branch_id', authenticateToken, getallSerialsOfitem);
  router.get('/finditem/:searchtext', authenticateToken, searchByItemnNameOrCodeorSerial);
  router.put('/updateqty/:postempid/:qty', authenticateToken, updateTempposqty);
  router.delete('/delete/:postempid', authenticateToken, deleteTemppos);

    // Routes for finish Sales

  router.get('/finish/:branch_id/:userid', authenticateToken, finishSales);




    return router;
};
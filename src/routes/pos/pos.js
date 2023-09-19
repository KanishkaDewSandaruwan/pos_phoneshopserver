const express = require('express');

const {
    addTempPosbySerial,
    getallTempposbyBbrnch,
    updateTempposqty,
    deleteTemppos,
    searchByItemnNameOrCodeorSerial,
    getallSerialsOfitem,
    addTempPosbyitemId

  } = require('../../mvc/pos/posController');
  
  const { authenticateToken } = require('../../middlewares/userAuth');
  const { authorizeAccessControll } = require('../../middlewares/userAccess');

  module.exports = (config) => {
    const router = express.Router();


    // Routes for TempposModel
  router.post('/createwithSerial/:serial_no/:branch_id', authenticateToken, addTempPosbySerial);
  router.post('/createwithNonSerial/:itemid/:branch_id', authenticateToken, addTempPosbyitemId);
  router.get('/alltemposbyBranch/:branch_id', authenticateToken, getallTempposbyBbrnch);
  router.get('/serials/:itemid/:branch_id', authenticateToken, getallSerialsOfitem);
  router.get('/finditem/:searchtext', authenticateToken, searchByItemnNameOrCodeorSerial);
  router.put('/updateqty/:postempid/:qty', authenticateToken, updateTempposqty);
  router.delete('/delete/:postempid', authenticateToken, deleteTemppos);




    return router;
};
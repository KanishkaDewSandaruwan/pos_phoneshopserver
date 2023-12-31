const express = require('express');
const {
  getAllGrns,
  getGrnById,
  getAllGrnsbyBranch,
  getAllGrnPayment,
  getAllGrnPaymentbyGrnno,
  addGrn,
  updateGrn,
  updateGrnStatus,
  deleteGrn,
  permanentDeleteGrn,
  deleteGrns,
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
  getAllGrnTempBYGRNNO,
  deleteGrnTemps,
  finishGrn,
} = require('../../mvc/grn/GRNController');

const {
  getAllTempItemDetails,
  getTempItemDetailsById,
  getTempItemDetailsBygrnTempId,
  addTempItemDetails,
  updateTempItemDetails,
  deleteTempItemDetails,
  permenentdeleteTempItemDetails,
  deletemultipleTempItemDetails,
  permenentdeletemultipleTempItemDetails,
  getAllitemSerial
} = require('../../mvc/grn/ItemDetailsController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  // Routes for Grn Model
  router.get('/all', authenticateToken, getAllGrns);
  router.get('/:grnId', authenticateToken, getGrnById);
  router.get('/allbyBranch/:branch_id', authenticateToken,getAllGrnsbyBranch);
  router.post('/create', authenticateToken, addGrn);
  router.put('/update/status/:grnId', authenticateToken, updateGrnStatus);
  router.put('/update/:grnId', authenticateToken, updateGrn);
  router.put('/delete/:grnId', authorizeAccessControll, deleteGrn);
  router.put('/delete', authorizeAccessControll, deleteGrns);
  router.get('/all/grnPayments', authenticateToken, getAllGrnPayment);
  router.get('/allgrnPaymentsbyGrnno/:grnno', authenticateToken, getAllGrnPaymentbyGrnno);
  router.delete('/permanent-delete/:grnId', authenticateToken, permanentDeleteGrn);

  // Routes for GrnTemp Model
  router.get('/temp/all', authenticateToken, getAllGrnTemp);
  router.get('/temp/all/:grnId', authenticateToken, getAllGrnTempBYGRNNO); //new //have to update
  router.get('/temp/:grnTempId', authenticateToken, getGrnTempById);
  router.post('/temp/create', authenticateToken, addGrnTemp);
//   router.put('/temp/update/:grnTempId', authenticateToken, updateGrnTemp);
//   router.put('/temp/update/:grnTempId/status', authenticateToken, updateGrnTempStatus);
  router.put('/temp/delete/:grntempid', authorizeAccessControll, deleteGrnTemp);
  router.delete('/temp/permanent-delete/:grntempid', authorizeAccessControll, permanentDeleteGrnTemp);
  router.put('/temp/delete', authenticateToken, deleteGrnTemps);
  router.put('/temp/UpdatePurchaseprice/:grntempid', authenticateToken, updateGrnTempPurchaseprice);
  router.put('/temp/UpdateSellprice/:grntempid', authenticateToken, updateGrnTempSellPrice);
  router.put('/temp/UpdateWholesaleprice/:grntempid', authenticateToken, updateGrnTempWholesaleprice);
  router.put('/temp/UpdateGrnqty/:grntempid', authenticateToken, updateGrnTempGrnqty);
  router.put('/temp/UpdateDiscount/:grntempid', authenticateToken, updateGrnTempDiscount);

  // Routes for  TempItemDetailsModel
  router.post('/tempitem/create', authenticateToken, addTempItemDetails);
  router.get('/tempitem/all', authenticateToken, getAllTempItemDetails);
  router.get('/tempitem/:temp_itemdetails_id', authenticateToken, getTempItemDetailsById);
  router.get('/tempitemBygrntemp/:grntempid', authenticateToken, getTempItemDetailsBygrnTempId);
  router.put('/tempitem/update/:temp_itemdetails_id', authenticateToken, updateTempItemDetails);
  router.put('/tempitem/delete/:temp_itemdetails_id', authenticateToken, deleteTempItemDetails);
  router.delete('/tempitem/delete/:temp_itemdetails_id', authenticateToken, permenentdeleteTempItemDetails);
  router.put('/tempitem/delete', authenticateToken, deletemultipleTempItemDetails);
  router.delete('/tempitem/delete', authenticateToken, permenentdeletemultipleTempItemDetails);
  router.get('/itemserials/all', authenticateToken, getAllitemSerial);

  
  //finalize grn
  router.get('/finish/:grnno/:branch_id', authenticateToken, finishGrn);



  return router;
};

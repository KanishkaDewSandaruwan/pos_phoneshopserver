const express = require('express');
const {
  getAllGrns,
  getGrnById,
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
  updateGrnTempStatus,
  deleteGrnTemp,
  permanentDeleteGrnTemp,
  deleteGrnTemps,
} = require('../../controllers/grn/GRNController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  // Routes for Grn Model
  router.get('/all', authenticateToken, getAllGrns);
  router.get('/:grnId', authenticateToken, getGrnById);
  router.post('/create', authenticateToken, addGrn);
//   router.put('/update/:grnId', authenticateToken, updateGrn);
  router.put('/update/status/:grnId', authenticateToken, updateGrnStatus);
//   router.put('/delete/:grnId', authorizeAccessControll, deleteGrn);
//   router.put('/delete', authorizeAccessControll, deleteGrns);
//   router.delete('/permanent-delete/:grnId', authorizeAccessControll, permanentDeleteGrn);

  // Routes for GrnTemp Model
  router.get('/temp/all', authenticateToken, getAllGrnTemp);
  router.get('/temp/:grnTempId', authenticateToken, getGrnTempById);
  router.post('/temp/create', authenticateToken, addGrnTemp);
//   router.put('/temp/update/:grnTempId', authenticateToken, updateGrnTemp);
//   router.put('/temp/update/:grnTempId/status', authenticateToken, updateGrnTempStatus);
//   router.put('/temp/delete/:grnTempId', authorizeAccessControll, deleteGrnTemp);
  router.put('/temp/delete', authenticateToken, deleteGrnTemps);
//   router.delete('/temp/permanent-delete/:grnTempId', authorizeAccessControll, permanentDeleteGrnTemp);

  return router;
};

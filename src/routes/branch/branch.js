const express = require('express');
const {
  getAllBranches,
  getBranchById,
  addBranch,
  updateBranch,
  updateBranchStatus,
  deleteBranch,
  permanentDeleteBranch,
  deleteBranches
} = require('../../controllers/branch/BranchController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addBranch);
  router.get('/all', authenticateToken, getAllBranches);
  router.get('/:branchId', authenticateToken, getBranchById);
  router.put('/status/:branchId', authenticateToken, updateBranchStatus);
  router.put('/delete/:branchId', authenticateToken, deleteBranch);
  router.put('/delete', authenticateToken, deleteBranches);
  router.put('/update/:branchId', authenticateToken, updateBranch);

  return router;
};

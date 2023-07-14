const express = require('express');
const {
  getAllUserRoles,
  getUserRoleById,
  addUserRole,
  updateUserRole,
  updateUserRoleStatus,
  deleteUserRole,
  permanentDeleteUserRole,
  deleteRoles
} = require('../../controllers/userrole/UserroleController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authenticateToken, addUserRole);
  router.get('/all', authenticateToken, getAllUserRoles);
  router.get('/:userRoleId', authenticateToken, getUserRoleById);
  router.put('/status/:userRoleId', authenticateToken, updateUserRoleStatus);
  router.put('/delete/:userRoleId', authenticateToken, deleteUserRole);
  router.put('/delete', authenticateToken, deleteRoles);
  router.put('/update/:userRoleId', authenticateToken, updateUserRole);

  return router;
};

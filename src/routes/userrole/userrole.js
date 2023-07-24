const express = require('express');
const {
  getAllUserRoles,
  getUserRoleById,
  addUserRole,
  updateUserRole,
  updateUserRoleStatus,
  deleteUserRole,
  permanentDeleteUserRole,
  deleteRoles,
  getUserRole
} = require('../../controllers/userrole/UserroleController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessSupoerAdmin } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/getuserrole/:userid', authenticateToken, getUserRole);

  //super admin only
  router.post('/create', authorizeAccessSupoerAdmin, addUserRole);
  router.get('/all', authorizeAccessSupoerAdmin, getAllUserRoles);
  router.get('/:userRoleId', authorizeAccessSupoerAdmin, getUserRoleById);
  router.put('/status/:userRoleId', authorizeAccessSupoerAdmin, updateUserRoleStatus);
  router.put('/delete/:userRoleId', authorizeAccessSupoerAdmin, deleteUserRole);
  router.put('/delete', authorizeAccessSupoerAdmin, deleteRoles);
  router.put('/update/:userRoleId', authorizeAccessSupoerAdmin, updateUserRole);

  return router;
};

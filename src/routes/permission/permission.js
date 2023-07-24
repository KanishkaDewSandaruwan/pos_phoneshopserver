const express = require('express');
const {
  getAllPermissions,
  getPermissionById,
  addPermission,
  updatePermission,
  deletePermission,
  permanentDeletePermission,
} = require('../../controllers/permission/PermissionController');
const { authorizeAccessSupoerAdmin } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessSupoerAdmin, addPermission);
  router.get('/all', authorizeAccessSupoerAdmin, getAllPermissions);
  router.get('/:permissionId', authorizeAccessSupoerAdmin, getPermissionById);
  router.put('/update/:permissionId', authorizeAccessSupoerAdmin, updatePermission);
  router.put('/delete/:permissionId', authorizeAccessSupoerAdmin, deletePermission);
  router.put('/delete/permanent/:permissionId', authorizeAccessSupoerAdmin, permanentDeletePermission);

  return router;
};

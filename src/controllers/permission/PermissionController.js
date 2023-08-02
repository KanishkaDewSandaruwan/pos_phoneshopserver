const PermissionModel = require('../../models/permission/PermissionModel');

const getAllPermissions = (req, res) => {
    PermissionModel.getAllPermissions((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getPermissionById = (req, res) => {
    const { permissionId } = req.params;

    PermissionModel.getPermissionById(permissionId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Permission not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addPermission = (req, res) => {
    const permission = req.body;


    PermissionModel.getPermissionByCode(permission.permission_code, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length > 0) {
            res.status(409).send({ error: 'This Permission Code already exists' });
            return;
        }

        PermissionModel.addPermission(permission, (error, permissionId) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (!permissionId) {
                res.status(404).send({ error: 'Failed to create permission' });
                return;
            }

            res.status(200).send({ message: 'Permission created successfully', permissionId });
        });
    });
};

const updatePermission = (req, res) => {
    const { permissionId } = req.params;
    const permission = req.body;

    PermissionModel.getPermissionById(permissionId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Permission not found' });
            return;
        }

        PermissionModel.getPermissionByCode(permission.permission_code, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'This Permission Code already exists' });
                return;
            }


            PermissionModel.updatePermission(permission, permissionId, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.affectedRows === 0) {
                    res.status(404).send({ error: 'Permission not found or no changes made' });
                    return;
                }

                res.status(200).send({ message: 'Permission updated successfully' });
            });
        });
    });
};

const permanentDeletePermission = (req, res) => {
    const { permissionId } = req.params;

    PermissionModel.getPermissionById(permissionId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Permission not found' });
            return;
        }

        PermissionModel.deletePermission(permissionId, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error deleting permission from the database' });
                return;
            }

            res.status(200).send({ message: 'Permission deleted successfully' });
        });
    });
};


module.exports = {
    getAllPermissions,
    getPermissionById,
    addPermission,
    updatePermission,
    permanentDeletePermission,
};

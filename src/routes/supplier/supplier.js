const express = require('express');

const { 
    getAllSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    updateSupplierStatus,
    deleteSupplier,
    permanentDeleteSupplier 
} = require('../../controllers/SupplierContoller');

const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', authenticateToken, addSupplier);
    router.get('/all', authenticateToken, getAllSuppliers);
    router.get('/:supplierId', authenticateToken, getSupplierById);
    router.put('/status/:supplierId', authenticateToken, updateSupplierStatus);
    router.put('/delete/:supplierId', authenticateToken, deleteSupplier);
    router.put('/update/:supplierId', authenticateToken, updateSupplier);

    return router;
};

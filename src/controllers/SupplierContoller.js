const SupplierModel = require('../models/SupplierModel');
const supplierView = require('../views/supplierView');

const getAllSuppliers = (req, res) => {
    SupplierModel.getAllSuppliers((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

const getSupplierById = (req, res) => {
    const { supplierId } = req.params;
    SupplierModel.getSupplierById(supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Supplier not found' });
            return;
        }

        res.status(200).send(results);
    });
}

const addSupplier = (req, res) => {
    const supplier = req.body; // Retrieve the supplier data from the request body

    SupplierModel.addSupplier(supplier, (error, supplierId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!supplierId) {
            res.status(404).send({ error: 'Failed to create supplier' });
            return;
        }

        res.status(200).send({ message: 'Supplier created successfully', supplierId });
    });
};

const updateSupplier = (req, res) => {
    const { supplierId } = req.params;
    const supplier = req.body;

    SupplierModel.updateSupplier(supplier, supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Supplier not found or no changes made' });
            return;
        }

        res.status(200).send({ message: 'Supplier updated successfully' });
    });
};

const updateSupplierStatus = (req, res) => {
    const { supplierId } = req.params;
    const { status } = req.body;

    SupplierModel.updateSupplierStatus(supplierId, status, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating status in the database' });
            return;
        }

        res.status(200).send({ message: 'Status updated successfully' });
    });
};

const deleteSupplier = (req, res) => {
    const { supplierId } = req.params;

    SupplierModel.deleteSupplier(supplierId, 1, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating deletion in the database' });
            return;
        }

        res.status(200).send({ message: 'Supplier deleted successfully' });
    });
};

// Additional methods for your requirements

const permanentDeleteSupplier = (req, res) => {
    const { supplierId } = req.params;

    SupplierModel.permanentDeleteSupplier(supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting supplier from the database' });
            return;
        }

        res.status(200).send({ message: 'Supplier permanently deleted successfully' });
    });
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    updateSupplierStatus,
    deleteSupplier,
    permanentDeleteSupplier
};

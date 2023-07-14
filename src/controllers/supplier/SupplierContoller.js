const SupplierModel = require('../../models/supplier/SupplierModel');
const supplierView = require('../../views/supplierView');

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

    SupplierModel.getSupplierById(supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Supplier not found' });
            return;
        }

        SupplierModel.updateSupplier(supplier, supplierId, (error, updateResult) => {
            if (error) {
                res.status(500).send({ error: 'Error updating supplier in the database' });
                return;
            }

            res.status(200).send({ message: 'Supplier updated successfully' });
        });
    });
};


const updateSupplierStatus = (req, res) => {
    const { supplierId } = req.params;
    const { status } = req.body;

    SupplierModel.getSupplierById(supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Supplier not found' });
            return;
        }

        SupplierModel.updateSupplierStatus(supplierId, status, (error, updateResult) => {
            if (error) {
                res.status(500).send({ error: 'Error updating supplier status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status updated successfully' });
        });
    });
};


const deleteSupplier = (req, res) => {
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

        SupplierModel.deleteSupplier(supplierId, (error, deleteResult) => {
            if (error) {
                res.status(500).send({ error: 'Error deleting supplier from the database' });
                return;
            }

            res.status(200).send({ message: 'Supplier deleted successfully' });
        });
    });
};



const deleteSuppliers = (req, res) => {
    const { supplierIds } = req.body;

    if (!Array.isArray(supplierIds) || supplierIds.length === 0) {
        res.status(400).send({ error: 'Invalid supplier IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const supplierId of supplierIds) {
        SupplierModel.getSupplierById(supplierId, (error, results) => {
            if (error) {
                failCount++;
            } else if (results.length === 0) {
                failCount++;
            } else {
                SupplierModel.deleteSupplier(supplierId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        failCount++;
                    } else {
                        successCount++;
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === supplierIds.length) {
                        const totalCount = supplierIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all suppliers have been processed
            if (successCount + failCount === supplierIds.length) {
                const totalCount = supplierIds.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
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
    permanentDeleteSupplier,
    deleteSuppliers
};

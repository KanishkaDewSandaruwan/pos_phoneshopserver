const SubcategoryModel = require('../models/SubcategoryModel');
// const subcategoryView = require('../views/subcategoryView');

const getAllSubcategories = (req, res) => {
    SubcategoryModel.getAllSubcategories((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getSubcategoryById = (req, res) => {
    const { subcategoryId } = req.params;
    SubcategoryModel.getSubcategoryById(subcategoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Subcategory not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addSubcategory = (req, res) => {
    const subcategory = req.body;

    SubcategoryModel.addSubcategory(subcategory, (error, subcategoryId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!subcategoryId) {
            res.status(404).send({ error: 'Failed to create subcategory' });
            return;
        }

        res.status(200).send({ message: 'Subcategory created successfully', subcategoryId });
    });
};

const updateSubcategory = (req, res) => {
    const { subcategoryId } = req.params;
    const subcategory = req.body;

    SubcategoryModel.updateSubcategory(subcategory, subcategoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Subcategory not found or no changes made' });
            return;
        }

        res.status(200).send({ message: 'Subcategory updated successfully' });
    });
};

const updateSubcategoryStatus = (req, res) => {
    const { subcategoryId } = req.params;
    const { status } = req.body;

    SubcategoryModel.updateSubcategoryStatus(subcategoryId, status, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating status in the database' });
            return;
        }

        res.status(200).send({ message: 'Status updated successfully' });
    });
};

const deleteSubcategory = (req, res) => {
    const { subcategoryId } = req.params;

    SubcategoryModel.deleteSubcategory(subcategoryId, 1, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating deletion in the database' });
            return;
        }

        res.status(200).send({ message: 'Subcategory deleted successfully' });
    });
};

const permanentDeleteSubcategory = (req, res) => {
    const { subcategoryId } = req.params;

    SubcategoryModel.permanentDeleteSubcategory(subcategoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting subcategory from the database' });
            return;
        }

        res.status(200).send({ message: 'Subcategory permanently deleted successfully' });
    });
};

module.exports = {
    getAllSubcategories,
    getSubcategoryById,
    addSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    deleteSubcategory,
    permanentDeleteSubcategory
};

const CategoryModel = require('../models/CategoryModel');
// const categoryView = require('../views/categoryView');

const getAllCategories = (req, res) => {
    CategoryModel.getAllCategories((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getCategoryById = (req, res) => {
    const { categoryId } = req.params;
    CategoryModel.getCategoryById(categoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addCategory = (req, res) => {
    const category = req.body;

    CategoryModel.addCategory(category, (error, categoryId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!categoryId) {
            res.status(404).send({ error: 'Failed to create category' });
            return;
        }

        res.status(200).send({ message: 'Category created successfully', categoryId });
    });
};

const updateCategory = (req, res) => {
    const { categoryId } = req.params;
    const category = req.body;

    CategoryModel.updateCategory(category, categoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Category not found or no changes made' });
            return;
        }

        res.status(200).send({ message: 'Category updated successfully' });
    });
};

const updateCategoryStatus = (req, res) => {
    const { categoryId } = req.params;
    const { status } = req.body;

    CategoryModel.updateCategoryStatus(categoryId, status, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating status in the database' });
            return;
        }

        res.status(200).send({ message: 'Status updated successfully' });
    });
};

const deleteCategory = (req, res) => {
    const { categoryId } = req.params;

    CategoryModel.deleteCategory(categoryId, 1, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating deletion in the database' });
            return;
        }

        res.status(200).send({ message: 'Category deleted successfully' });
    });
};

const permanentDeleteCategory = (req, res) => {
    const { categoryId } = req.params;

    CategoryModel.permanentDeleteCategory(categoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting category from the database' });
            return;
        }

        res.status(200).send({ message: 'Category permanently deleted successfully' });
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
    permanentDeleteCategory
};

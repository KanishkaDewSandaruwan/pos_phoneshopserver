const ShopModel = require('../models/ShopModel');

// Regular expression patterns for mobile number and email validation
const mobileNumberPattern = /^[0-9]{10}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateMobileNumber = (mobileNumber) => {
    return mobileNumberPattern.test(mobileNumber);
};

const validateEmail = (email) => {
    return emailPattern.test(email);
};

const getAllShops = (req, res) => {
    ShopModel.getAllShops((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getShopById = (req, res) => {
    const { shopId } = req.params;
    ShopModel.getShopById(shopId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Shop not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addShop = (req, res) => {
    const shop = req.body;

    // Validate mobile number and email
    if (!validateMobileNumber(shop.shopnphonenumber)) {
        res.status(400).send({ error: 'Invalid mobile number' });
        return;
    }

    if (!validateEmail(shop.email)) {
        res.status(400).send({ error: 'Invalid email' });
        return;
    }

    ShopModel.addShop(shop, (error, shopId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!shopId) {
            res.status(404).send({ error: 'Failed to create shop' });
            return;
        }

        res.status(200).send({ message: 'Shop created successfully', shopId });
    });
};

const updateShop = (req, res) => {
    const { shopId } = req.params;
    const shop = req.body;

    // Validate mobile number and email
    if (shop.shopnphonenumber && !validateMobileNumber(shop.shopnphonenumber)) {
        res.status(400).send({ error: 'Invalid mobile number' });
        return;
    }

    if (shop.email && !validateEmail(shop.email)) {
        res.status(400).send({ error: 'Invalid email' });
        return;
    }

    ShopModel.getShopById(shopId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Shop not found' });
            return;
        }

        ShopModel.updateShop(shop, shopId, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'Shop not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'Shop updated successfully' });
        });
    });
};

const deleteShop = (req, res) => {
    const { shopId } = req.params;

    ShopModel.getShopById(shopId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Shop not found' });
            return;
        }

        ShopModel.deleteShop(shopId, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Shop deleted successfully' });
        });
    });
};

const permanentDeleteShop = (req, res) => {
    const { shopId } = req.params;

    ShopModel.permanentDeleteShop(shopId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting shop from the database' });
            return;
        }

        res.status(200).send({ message: 'Shop permanently deleted successfully' });
    });
};

module.exports = {
    getAllShops,
    getShopById,
    addShop,
    updateShop,
    deleteShop,
    permanentDeleteShop,
};

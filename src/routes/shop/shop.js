const express = require('express');
const {
    getShop,
    addShop,
    updateShop,
} = require('../../controllers/ShopController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', authenticateToken, addShop);
    router.get('/all', authenticateToken, getShop);
    router.put('/update', authenticateToken, updateShop);

    return router;
};

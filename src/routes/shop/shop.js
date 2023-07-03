const express = require('express');
const {
    getAllShops,
    getShopById,
    addShop,
    updateShop,
    deleteShop,
    permanentDeleteShop,
} = require('../../controllers/ShopController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', authenticateToken, addShop);
    router.get('/all', authenticateToken, getAllShops);
    router.get('/:shopId', authenticateToken, getShopById);
    router.put('/delete/:shopId', authenticateToken, deleteShop);
    router.put('/update/:shopId', authenticateToken, updateShop);

    return router;
};

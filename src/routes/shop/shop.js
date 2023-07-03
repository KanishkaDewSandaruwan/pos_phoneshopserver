const express = require('express');
const {
    getShop,
    addShop,
    updateShop,
    updateLogo
} = require('../../controllers/ShopController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { uploadLogo } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', authenticateToken, addShop);
    router.get('/all', authenticateToken, getShop);
    router.put('/update', authenticateToken, updateShop);
    router.put('/logo', uploadLogo.single('logo'), authenticateToken, updateLogo);

    return router;
};

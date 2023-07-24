const express = require('express');
const {
    getShop,
    addShop,
    updateShop,
    updateLogo
} = require('../../controllers/shop/ShopController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { uploadLogo } = require('../../../config/fileUpload');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();

    //admin only
    // router.post('/create', authorizeAccessControll, addShop);
    router.get('/all', authorizeAccessControll, getShop);
    router.put('/update', authorizeAccessControll, updateShop);
    router.put('/logo', uploadLogo.single('logo'), authorizeAccessControll, updateLogo);

    return router;
};

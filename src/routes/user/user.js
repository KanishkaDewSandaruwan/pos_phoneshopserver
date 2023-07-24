const express = require('express');

const { login, getAll, getUserById, updateUserProfile, addUser, updateUser, changeEmail, deleteUsers, findUser, changePassword, changeStatus, deleteuser } = require('../../controllers/user/UserController');
const { authenticateToken, authorizeValidateUser } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');
const { uploadProfile } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/create', uploadProfile.single('profile'), addUser);
    router.post('/login', login);

    //admin controls
    router.get('/all', authorizeAccessControll, getAll);
    router.get('/:userid', authorizeAccessControll, findUser);
    router.put('/status/:userid', authorizeAccessControll, changeStatus);
    router.put('/delete/:userid', authorizeAccessControll, deleteuser);
    router.put('/delete', authorizeAccessControll, deleteUsers); 
    router.put('/update/:userid', authorizeAccessControll, updateUser);

    //profile
    router.get('/me/:userid', authorizeValidateUser, getUserById);
    router.get('/me/profilechange/:userid', uploadProfile.single('profile'), authorizeValidateUser, updateUserProfile);
    router.put('/me/update/:userid', authorizeValidateUser, updateUser);
    router.put('/me/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/me/changeEmail/:userid', authorizeValidateUser, changeEmail);
    router.put('/me/deleteme/:userid', authorizeValidateUser, deleteuser);

    return router;
};

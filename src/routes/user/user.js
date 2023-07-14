const express = require('express');

const { login, getAll, getUserById, addUser, updateUser, deleteUsers, findUser, changePassword, changeStatus, deleteuser } = require('../../controllers/user/UserController');
const { authenticateToken, authorizeValidateUser, authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/create', addUser);
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
    router.put('/me/update/:userid', authorizeValidateUser, updateUser);
    router.put('/me/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/me/changeEmail/:userid', authorizeValidateUser, updateUser);
    router.put('/me/deleteme/:userid', authorizeValidateUser, deleteuser);

    return router;
};

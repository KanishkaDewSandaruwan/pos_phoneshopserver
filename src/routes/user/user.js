const express = require('express');

const { login, getAll, getUserById, addUser, updateUser, deleteUsers, findUser, changePassword, changeStatus, deleteuser } = require('../../controllers/UserController');
const { authenticateToken, authorizeValidateUser, authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', addUser);
    router.post('/login', login);

    router.get('/all', authenticateToken, getAll);
    router.get('/:userid', authenticateToken, findUser);
    router.put('/status/:userid', authenticateToken, changeStatus);
    router.put('/delete/:userid', authenticateToken, deleteuser);
    router.put('/delete', authenticateToken, deleteUsers); //

    router.get('/me/:userid', authorizeValidateUser, getUserById);
    router.put('/update/:userid', authorizeValidateUser, updateUser);

    router.put('/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/changeEmail/:userid', authorizeValidateUser, updateUser);
    router.put('/deleteme/:userid', authorizeValidateUser, deleteuser);

    return router;
};

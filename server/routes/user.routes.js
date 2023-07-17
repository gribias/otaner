import express from 'express';

// IMPORT ALL THE CONTROLLERS

import {
    createUser, getAllUsers,fetchUsers, getUserInfoByID
} from '../controllers/user.controller.js'

const router = express.Router();

router.route('/').get(fetchUsers);
router.route('/').post(createUser);
//router.route('/').get(getUserInfoByID);

export default router;
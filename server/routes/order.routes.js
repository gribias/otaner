import express from 'express';

import {
    createOrder,
    getOrders,
    getOrderDetail,
    updateOrder
    // createProduct, deleteProduct, getAllProducts, getProductDetail,
    // updateProduct
} from '../controllers/order.controller.js'


const router = express.Router();

 router.route('/').get(getOrders);
 router.route('/:id').get(getOrderDetail);
router.route('/').post(createOrder);
router.route('/:id').patch(updateOrder);
// router.route('/:id').delete(deleteProduct);


export default router;
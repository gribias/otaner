import express from 'express';

import {
    createProduct, deleteProduct, getAllProducts, getProductDetail,
    updateProduct
} from '../controllers/product.controller.js'


const router = express.Router();

router.route('/').get(getAllProducts);
router.route('/:id').get(getProductDetail);
router.route('/').post(createProduct);
router.route('/:id').patch(updateProduct);
router.route('/:id').delete(deleteProduct);


export default router;
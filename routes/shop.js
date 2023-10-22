const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

const isAuth = require('../middleware/is-auth');
const requireRole = require('../middleware/reiquire-role');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, requireRole('user'), shopController.getCart);

router.post('/cart-delete-item', isAuth, requireRole('user'), shopController.postCartDeleteProduct);

router.post('/cart', isAuth, requireRole('user'), shopController.postCart);

router.get('/orders', isAuth, requireRole('admin'), shopController.getOrders);

router.post('/create-order', isAuth, requireRole('user'), shopController.postOrder);

module.exports = router;

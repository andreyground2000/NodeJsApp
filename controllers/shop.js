const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(data => {
      res.render('shop/product-list', {
        prods: data,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
  const id = req.params.productId;
  
  Product.fetchProduct(id)
    .then(data => {
      res.render('shop/product-detail', {
        product: data,
        pageTitle: data.title,
        path: '/products'
      });
    })
    .catch((err) => {
      console.log(err);
    })
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(data => {
      res.render('shop/index', {
        prods: data,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    }))
    .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  
  Product.fetchProduct(prodId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
};

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  req.user
    .deleteFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders
      });
    })
    .catch(err => console.log(err))
};

exports.postOrder = (req, res) => {
  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res) => {
  const id = req.params.productId;
  
  Product.findId(id, (product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];

      for (product of products) {
        const cartData = cart.products.find((p) => p.id === product.id);

        if (cartData) {
          cartProducts.push({productData: product, qty: cartData.qty})
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
  })
};

exports.postCart = (req, res) => {
  const id = req.body.productId;

  Product.findId(id, (product) => {
    Cart.addProduct(id, product.price);
  });

  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res) => {
  const id = req.body.productId;

  Product.findId(id, (product) => {
    Cart.deleteProduct(id, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

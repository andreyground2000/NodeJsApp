const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([data]) => {
      res.render('shop/product-list', {
        prods: data,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch();
};

exports.getProduct = (req, res) => {
  const id = req.params.productId;
  
  Product.findId(id)
    .then(([data]) => {
      res.render('shop/product-detail', {
        product: data[0],
        pageTitle: data[0].title,
        path: '/products'
      });
    })
    .catch((err) => {
      console.log(err);
    })
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([data]) => {
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

const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  
  Product.findByPk(id)
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
  Product.findAll()
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
    .then(cart => cart.getProducts())
    .then(products => res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    }))
    .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      if (products.length > 0) {
        const product = products[0];

        newQuantity = product.cartItem.quantity + 1;

        return product;
      }
      
      return Product.findByPk(prodId)
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
};

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  req.user
  .getCart()
  .then((cart) => cart.getProducts({ where: { id: productId } }))
  .then((products) => products[0].cartItem.destroy())
  .then(() => res.redirect('/cart'))
  .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({include: ['products']})
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
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity }
              return product;
            })
          )
        })
        .catch(err => console.log(err));
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

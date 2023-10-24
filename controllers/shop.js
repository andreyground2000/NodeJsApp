const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res) => {
  Product.find()
    .then((data) => {
      res.render("shop/product-list", {
        prods: data,
        pageTitle: "All Products",
        path: "/products",
        isLoggedIn: req.session.isLoggedIn,
        role: req.user?.role,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const id = req.params.productId;

  Product.findById(id)
    .then((data) => {
      res.render("shop/product-detail", {
        product: data,
        pageTitle: data.title,
        path: "/products",
        isLoggedIn: req.session.isLoggedIn,
        role: req.user?.role,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res) => {
  Product.find()
    .then((data) => {
      res.render("shop/index", {
        prods: data,
        pageTitle: "Shop",
        path: "/",
        isLoggedIn: req.session.isLoggedIn,
        role: req.user?.role,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isLoggedIn: req.session.isLoggedIn,
        role: req.user.role,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect("/cart"));
};

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  req.user
    .deleteFromCart(productId)
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  Order.find()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
        isLoggedIn: req.session.isLoggedIn,
        role: req.user.role,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((p) => ({
        product: { ...p.productId._doc },
        quantity: p.quantity,
      }));
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = JSON.parse(req.query.edit);

  if (!editMode) {
    return res.redirect('/');
  }

  const id = req.params.productId;

  Product.findId(id, (product) => {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product,
      editing: editMode
    });
  });
};

exports.postEditProduct = (req, res) => {
  Product.edit(req.body);
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
  const { productId, price } = req.body;
  
  Product.delete(productId);
  Cart.deleteProduct(productId, price);
  res.redirect('/admin/products');
}
// const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const user = req.user;

  const product = new Product({ title, price, imageUrl, description, userId: user._id});

  product.save()
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = JSON.parse(req.query.edit);

  if (!editMode) {
    return res.redirect('/');
  }

  const id = req.params.productId;

  Product.findById(id)
  .then(product=> {
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
  const {
    title,
    price,
    imageUrl,
    description,
    productId
  } = req.body
  Product
    .findByIdAndUpdate(productId, { title, price, imageUrl, description })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  
  Product
    .findByIdAndRemove(productId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
}
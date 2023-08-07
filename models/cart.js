const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cb(JSON.parse(fileContent));
      }
    })
  }

  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0};

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIdx = cart.products.findIndex((prod) => prod.id === id );

      existingProductIdx > -1 
      ? cart.products[existingProductIdx].qty += 1 
      : cart.products = [...cart.products, { id, qty: 1 }];
  
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  };

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {

      if (err) {
        return;
      }

      const cart = JSON.parse(fileContent);

      if (cart && cart.products.length) {
        const existingProductIdx = cart.products.findIndex((prod) => prod.id === id );

        if (existingProductIdx > -1) {
          cart.totalPrice -= cart.products[existingProductIdx].qty * productPrice;
          cart.products.splice(existingProductIdx, 1);

          fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.log(err);
          });
        }
      }
    });
  }
};
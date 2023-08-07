const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.id = Math.random().toString();
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static edit({
    productId,
    description,
    price,
    imageUrl,
    title
  }) {
    getProductsFromFile(prd => {
      const editIdx = prd.find(p => p.id === productId);
      
      const editedProduct = {
        id: productId,
        description,
        price,
        title,
        imageUrl
      }

      prd.splice(editIdx, 1, editedProduct);

      fs.writeFile(p, JSON.stringify(prd), err => {
        console.log(err);
      })
    });
  }

  static delete(id) {
    getProductsFromFile(prd => {
      const deleteIdx = prd.findIndex(p => p.id === id);
      
      prd.splice(deleteIdx, 1);

      fs.writeFile(p, JSON.stringify(prd), err => {
        console.log(err);
      })
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findId(id, cb) {
    getProductsFromFile(prd => {
      cb(prd.find(p => p.id === id));
    }); 
  }
};

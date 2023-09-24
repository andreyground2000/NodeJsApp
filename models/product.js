const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl,
    this.description = description;
    this._id = id;
    this.userId = userId;
  }

  save() {
    const db = getDb();

    return db.collection('products')
      .insertOne(this)
      .catch(err => {
        console.log(err);
      })
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => products)
      .catch(err => console.log(err))
  }

  static fetchProduct(id) {
    const db = getDb();

    return db
      .collection('products')
      .find({_id: new mongoDb.ObjectId(id)})
      .next()
      .then(product => product)
      .catch(err => console.log(err))
  }
  
  static editProduct(productData) {
    const db = getDb();
    const {
      productId,
      title,
      price,
      imageUrl,
      description 
    } = productData;

    return db
      .collection('products')
      .updateOne({_id: new mongoDb.ObjectId(productId)}, {$set: {
        title,
        price,
        imageUrl,
        description
      }})
  }

  static deleteProduct(id) {
    const db = getDb();

    return db
      .collection('products')
      .deleteOne({_id: new mongoDb.ObjectId(id)})
      .catch(err => console.log(err))
  }
}


module.exports = Product;
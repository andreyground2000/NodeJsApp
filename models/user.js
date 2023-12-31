  const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email, id, cart = { items: [] }) {
    this.name = name;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const db = getDb();

    return db.collection('users')
      .insertOne(this)
      .catch(err => {
        console.log(err);
      })
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map(p => p.productId);

    return db
      .collection('products')
      .find({ _id: { $in: productIds }})
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items
              .find(cp => cp.productId.toString() === p._id.toString()).quantity
          }
        })
      })
  }

  addToCart(product) {
    const db = getDb();

    const cartProductIdx = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIdx >= 0) {
      newQuantity = this.cart.items[cartProductIdx].quantity + 1;
      updatedCartItems[cartProductIdx].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectId(product._id),
        quantity: newQuantity
      })
    }

    const updatedCart = { items: updatedCartItems };
    return db
      .collection('users')
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
  }

  deleteFromCart(id) {
    const db = getDb();

    return db
    .collection('users')
    .updateOne(
      { _id: new mongoDb.ObjectId(this._id) },
      { $set: {
          cart: { 
          items: this.cart.items.filter(i => i.productId.toString() !== id.toString())
        }
      }}
    )
  }

  getOrders() {
    const db = getDb();

    return db
      .collection('orders')
      .find({'user._id': new mongoDb.ObjectId(this._id)})
      .toArray()
  }

  addOrder() {
    const db = getDb();
    
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongoDb.ObjectId(this._id),
            name: this.name,
          }
        };

        return db.collection('orders')
          .insertOne(order)
      })
      .then(() => {
        this.cart = { items: [] }

        return db.collection('users')
          .updateOne(
            {_id: new mongoDb.ObjectId(this._id)},
            { $set: { cart: { items: [] } } }
          )
      })
  }

  static fetchUser(id) {
    const db = getDb();

    return db.collection('users')
      .findOne({_id: new mongoDb.ObjectId(id)})
      .then(user => user)
      .catch(err => console.log(err))
  }
}

module.exports = User;


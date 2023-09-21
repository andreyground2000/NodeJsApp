const mongoDb = require('mongodb');
const MongoClient = mongoDb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect('mongodb+srv://JJXzEZwt0Wi5N4UA:JJXzEZwt0Wi5N4UA@rocafella.xuhueax.mongodb.net/nodeshop?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected successfully');
      _db = client.db();
      cb(client)
    })
    .catch(err => console.log(err));
}

const getDb = () => {
  if (!_db) {
    throw "No database found"
  }

  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;



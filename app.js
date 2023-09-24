const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const User = require('./models/user');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.fetchUser('650721593ffafd7e2fe0748e')
//     .then(user => {
//       req.user = new User(user.email, user.name, user._id, user.cart);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose
  .connect('mongodb+srv://JJXzEZwt0Wi5N4UA:JJXzEZwt0Wi5N4UA@rocafella.xuhueax.mongodb.net/nodeshop?retryWrites=true&w=majority')
  .then(() => app.listen(3000))
  .catch((err) => console.log(err))

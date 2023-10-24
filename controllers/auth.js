const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passport = require("passport");

exports.getLogin = (_, res) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: false,
  });
};

exports.getSignup = (_, res) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isLoggedIn: false,
  });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err || !user) {
      return res.redirect("/login");
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.redirect("/login");
      }
      req.session.isLoggedIn = true;
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            role: isAdmin ? "admin" : "user",
            cart: { items: [] },
          });

          return user.save();
        })
        .then(() => res.redirect("/login"));
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/products");
  });
};

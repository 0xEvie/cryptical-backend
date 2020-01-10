var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Register User
router.register = function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  // Validation
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.status(500).send(errors);
  }
  else {
    //checking for email already taken
    User.findOne({email: email}, function (err, mail) {
      if (mail) {
        res.status(500).send('User Already Exists');
      }
      else {
        var newUser = new User({
          email: email,
          password: password
        });
        newUser.save(function (err) {
          if (err)
            res.status(500).send(errors);
          else
            res.send('You are registered and can now login');
        });
      }
    });
  }
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function (username, password, done) {
  User.findOne({email: username, password:password}, function (err, user) {
    if (err)
      return done(err);
    if (!user)
      return done(null, false, {message: 'Authentication Failed'});

    return done(null, user);
  });
}
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.login = function (req, res) {
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();

  if (req.validationErrors()) {
    res.status(500).send(errors);
  }
  else {
    res.send('You\'re now logged in');
  }
};
// If authenticated don't show login

router.logout = function (req, res) {
  req.logout();

  res.send('You are logged out');
};

router.post('/register', router.register);
router.post('/login', passport.authenticate('local'), router.login);
router.get('/logout', router.logout);

module.exports = router;
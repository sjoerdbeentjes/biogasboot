const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

const User = require('../models/user');

// login
router.get('/login', (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

// register
router.get('/register', (req, res) => {
  if (res.locals.user && res.locals.user.role === 'admin') {
    res.render('register');
  } else {
    res.status(404).render('404');
  }
});

router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  // validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('role', 'Role is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors
    });
  } else {
    const newUser = new User({
      name,
      email,
      username,
      role,
      password,
      warningValue: 150
    });

    User.find({name: username}, (err, user) => {
      if (user.length) {
        res.locals.errors = [{
          msg: 'Deze gebruikersnaam is al in gebruik'
        }];
        res.render('register');
      } else {
        User.find({email}, (err, user) => {
          if (user.length) {
            res.locals.errors = [{
              msg: 'Dit emailadres is al in gebruik'
            }];
            res.render('register');
          } else {
            User.createUser(newUser, (err, user) => {
              if (err) {
                throw err;
              }

              res.redirect('/auth/login');
            });
          }
        });
      }
    });
  }
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.getUserByUserName(username, (err, user) => {
      if (err) throw err;

      if (!user) {
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }),
  (req, res) => {
    res.redirect('/');
  });

// logout
router.get('/logout', (req, res) => {
  req.logout();

  res.redirect('/auth/login');
});

module.exports = router;

/**
 * Simple and pretty site for documentation and sale of dev solutions.
 *
 * @author Anton Lukin
 * @license MIT
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');
const expurl = require('express-normalizeurl');
const version = require('project-version');
const ip = require('request-ip');
const cookies = require('cookie-parser');

// Require settings.
require('dotenv').config();

// Create express instance.
const server = express();

// Solve the trailing slashes problem.
server.enable('strict routing');

// Add trailing slashes
server.use(expurl());

// Set request ip middleware.
server.use(ip.mw());

// Parse form data requests.
server.use(express.urlencoded({extended: true}));

// Parse cookies.
server.use(cookies());

// Add assets and images folders.
server.use('/assets/', express.static('assets'));
server.use('/images/', express.static('images'));

// Set root local variable.
server.use((req, res, next) => {
  server.locals.root = req.protocol + '://' + req.get('host');
  next();
});

// Set views engine and templates path.
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '/views'));

// Set global variables.
server.locals.views = server.get('views');
server.locals.version = version;

// Hide specific Express header.
server.disable('x-powered-by');

// Add json answers middleware.
server.use((req, res, next) => {
  const answer = {};

  res.answer = (success = true, code = 200, result = null) => {
    answer.success = success;

    if (result) {
      answer.result = result;
    }

    return res.status(code).json(answer);
  };

  next();
});

// Require app routes.
const routes = require('./routes');
server.use('/', routes);

server.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  console.error(err);

  res.locals.meta = {
    title: 'Server error / wpget.org',
  };

  res.status(err.status || 500);
  res.render('pages/error', {
    message: 'An unexpected server error has occurred. Contact us if it happens again.',
  });
});

server.use((req, res) => {
  res.locals.meta = {
    title: 'Page not found / wpget.org',
  };

  res.status(404);
  res.render('pages/error', {
    message: 'The link you followed may be broken, or the page may have been removed.',
  });
});

// Start express app.
server.listen(process.env.PORT || 3000);

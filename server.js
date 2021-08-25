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

// Require app routes.
const routes = require('./routes');

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

server.use('/social-planner', routes['social-planner']);
server.use('/sharing-image', routes['sharing-image']);

server.get('/', (req, res, next) => {
  res.locals.meta = {
    title: 'wpget.org/',
    description: 'Description',
    url: '/',
  };

  res.render('pages/index');
});

server.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  res.status(err.status || 500);
  res.render('pages/error', {meta: {}});

  if (err.console) {
    console.error(err.console);
  }
});

server.use(function(req, res) {
  res.status(404);
  res.render('pages/error', {meta: {}});
});


// Start express app.
server.listen(process.env.PORT || 3000);

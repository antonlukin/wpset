/**
 * Simple and pretty site for documentation and sale of dev solutions.
 *
 * @author Anton Lukin
 * @license MIT
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');
const version = require('project-version');

// Create express instance.
const server = express();

// Solve the trailing slashes problem.
server.enable('strict routing');

// Add assets and images folders.
server.use('/assets/', express.static('assets'));
server.use('/images/', express.static('images'));

server.use((req, res, next) => {
  if (req.path.substr(-1) !== '/' || req.path.length <= 1) {
    return next();
  }

  const query = req.url.slice(req.path.length);

  // Redirect to slug w/out trailing slash.
  res.redirect(301, req.path.slice(0, -1) + query);
});

// Set views engine and templates path.
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, '/views'));

// Set global variables.
server.locals.views = server.get('views');
server.locals.version = version;

// Require settings.
require('dotenv').config();

// Hide specific Express header.
server.disable('x-powered-by');

// Require app routes.
const routes = require('./routes');

server.get('/', (req, res, next) => {
  res.render(path.join('parts', 'footer'));
});

server.use('/social-planner', routes['social-planner']);
server.use('/sharing-image', routes['sharing-image']);

// Start express app.
server.listen(process.env.PORT || 3000);

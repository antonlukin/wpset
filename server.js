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

// Create express instance.
const server = express();

// Solve the trailing slashes problem.
server.enable('strict routing');

// Add trailing slashes
server.use(expurl());

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

// Require settings.
require('dotenv').config();

// Hide specific Express header.
server.disable('x-powered-by');

// Require app routes.
const routes = require('./routes');

server.get('/', (req, res, next) => {
  const meta = {
    title: 'Social Planner',
    description: 'Description',
    url: '/social-planner',
  };

  res.render('pages/index', {meta: meta});
});

server.use('/social-planner', routes['social-planner']);
server.use('/sharing-image', routes['sharing-image']);

// Start express app.
server.listen(process.env.PORT || 3000);

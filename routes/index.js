const express = require('express');
const router = new express.Router();

router.get('/about/', (req, res, next) => {
  res.locals.meta = {
    title: 'About us / wpget.org',
    description: 'Description',
    url: '/',
  };

  res.render('pages/about');
});

router.get('/contact/', (req, res, next) => {
  res.locals.meta = {
    title: 'Contact us / wpget.org',
    description: 'Description',
    url: '/contact/',
  };

  res.render('pages/contact');
});

router.get('/', (req, res, next) => {
  res.locals.meta = {
    title: 'wpget.org / Progressive software solutions for WordPress',
    description: 'Description',
    url: '/',
  };

  res.render('pages/index');
});

router.use('/social-planner/', require('./social-planner'));
router.use('/sharing-image/', require('./sharing-image'));
router.use('/instapress/', require('./instapress'));

module.exports = router;

const express = require('express');
const router = new express.Router();

router.get('/about/', (req, res, next) => {
  res.locals.meta = {
    title: 'About us / wpset.org',
    description: 'We are a software solutions developers for WordPress with over 10 years of experience in programming.',
    url: '/about/',
  };

  res.render('pages/about');
});

router.get('/contact/', (req, res, next) => {
  res.locals.meta = {
    title: 'Contact us / wpset.org',
    description: 'Information on how to contact us if you have any difficulties with our products.',
    url: '/contact/',
  };

  res.render('pages/contact');
});

router.get('/privacy/', (req, res, next) => {
  res.locals.meta = {
    title: 'Privacy Policy / wpset.org',
    description: 'Information about how we handle user data.',
    url: '/privacy/',
  };

  res.render('pages/privacy');
});

router.get('/', (req, res, next) => {
  res.locals.meta = {
    title: 'wpset.org / Progressive software solutions for WordPress',
    description: 'We create progressive software solutions for WordPress. Our ultimate goal is to build secure and confidential applications for the needs of your business or personal projects.',
    url: '/',
  };

  res.render('pages/index');
});

router.use('/social-planner/', require('./social-planner'));
router.use('/sharing-image/', require('./sharing-image'));
router.use('/instapress/', require('./instapress'));

module.exports = router;

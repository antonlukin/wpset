const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.locals.meta = {
    title: 'Social Planner',
    description: 'Description',
    url: '/social-planner/',
  };

  res.render('pages/social-planner/index');
});

router.get('/setup/', (req, res) => {
  res.locals.meta = {
    title: 'Social Planner: setup',
    description: 'Description',
    url: '/social-planner/setup/',
  };

  res.render('pages/social-planner/setup');
});

router.get('/hooks/', (req, res) => {
  res.locals.meta = {
    title: 'Social Planner: hooks',
    description: 'Description',
    url: '/social-planner/hooks/',
  };

  res.render('pages/social-planner/hooks');
});

module.exports = router;

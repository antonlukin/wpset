const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.locals.meta = {
    title: 'Social Planner',
    description: 'WordPress plugin for scheduling announcements of posts to your social networks accounts.',
    url: '/social-planner/',
  };

  res.render('pages/social-planner/index');
});

router.get('/setup/', (req, res) => {
  res.locals.meta = {
    title: 'Social Planner: setup',
    description: 'Detailed plugin configuration instruction.',
    url: '/social-planner/setup/',
  };

  res.render('pages/social-planner/setup');
});

router.get('/hooks/', (req, res) => {
  res.locals.meta = {
    title: 'Social Planner: hooks',
    description: 'The plugin provides developers with a large number of hooks that can be used to change its the behavior.',
    url: '/social-planner/hooks/',
  };

  res.render('pages/social-planner/hooks');
});

router.get('/callback/', (req, res) => {
  if (!req.query.code) {
    return res.send('Code is not set');
  }

  res.send(req.query.code);
});

module.exports = router;

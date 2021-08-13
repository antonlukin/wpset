const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  const meta = {
    title: 'Social Planner',
    description: 'Description',
    url: '/social-planner',
  };

  res.render('pages/social-planner/index', {meta: meta});
});

router.get('/setup/', (req, res) => {
  const meta = {
    title: 'Social Planner: setup',
    description: 'Description',
    url: '/social-planner/setup',
  };

  res.render('pages/social-planner/setup', {meta: meta});
});

router.get('/hooks/', (req, res) => {
  const meta = {
    title: 'Social Planner: hooks',
    description: 'Description',
    url: '/social-planner/hooks',
  };

  res.render('pages/social-planner/hooks', {meta: meta});
});

module.exports = router;

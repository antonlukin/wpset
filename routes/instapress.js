const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.locals.meta = {
    title: 'Instapress',
    description: 'Description',
    url: '/instapress/',
  };

  res.render('pages/instapress/index');
});

module.exports = router;

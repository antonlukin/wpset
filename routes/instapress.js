const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.locals.meta = {
    title: 'Instapress',
    description: 'Fast and furious WordPress theme to share photos with small description. Inspired by Instagram, it also allows you to leave comments, supports categories, sticky posts, tags, search page and much more.',
    url: '/instapress/',
  };

  res.render('pages/instapress/index');
});

module.exports = router;

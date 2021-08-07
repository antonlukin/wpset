const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.render('pages/sharing-image/index');
});

router.get('/setup', (req, res) => {
  res.render('pages/sharing-image/setup');
});

module.exports = router;

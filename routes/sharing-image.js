const express = require('express');
const router = new express.Router();

const nonce = require('../utils/nonce');
const models = require('../models');
const {key, host} = models['sharing-image'];

router.get('/', (req, res) => {
  res.locals.meta = {
    title: 'Sharing Image',
    description: 'Description',
    url: '/sharing-image/',
  };

  res.render('pages/sharing-image/index');
});

router.get('/hooks/', (req, res) => {
  res.locals.meta = {
    title: 'Sharing Image: hooks',
    description: 'Description',
    url: '/sharing-image/hooks/',
  };

  res.render('pages/sharing-image/hooks');
});

router.post('/licenses/login/', async (req, res) => {
  if (!req.body.key) {
    return res.redirect('/sharing-image/licenses/login/');
  }

  const license = await key.findOne({
    where: {key: req.body.key},
  });

  if (null === license) {
    return res.redirect('/sharing-image/licenses/login/?message=1');
  }

  if ('blocked' === license.status) {
    return res.redirect('/sharing-image/licenses/login/?message=2');
  }

  if ('expired' === license.status) {
    return res.redirect('/sharing-image/licenses/login/?message=3');
  }

  res.cookie('sharing-image-premium', req.body.key, {
    maxAge: 604800000,
    path: '/sharing-image/licenses/',
    httpOnly: true,
  });

  res.redirect('/sharing-image/licenses/');
});

router.get('/licenses/login/', async (req, res) => {
  if (req.cookies['sharing-image-premium']) {
    return res.redirect('/sharing-image/licenses/');
  }

  let warning = null;

  switch (req.query.message) {
    case '1':
      warning = 'The premium key is invalid.';
      break;

    case '2':
      warning = 'The premium key was blocked.';
      break;

    case '3':
      warning = 'The premium key expired.';
      break;
  }

  res.locals.meta = {
    title: 'Sharing Image',
    description: 'Description',
    url: '/sharing-image/licenses/login/',
  };

  res.render('pages/sharing-image/login', {
    warning: warning,
  });
});

router.post('/licenses/logout/', async (req, res) => {
  res.clearCookie('sharing-image-premium', {
    path: '/sharing-image/licenses/',
  });
  res.redirect('/sharing-image/licenses/login/');
});

router.get('/licenses/', async (req, res, next) => {
  if (!req.cookies['sharing-image-premium']) {
    return res.redirect('/sharing-image/licenses/login/');
  }

  const premium = req.cookies['sharing-image-premium'];

  try {
    const license = await key.findOne({
      where: {key: premium},
    });

    if (license && 'valid' === license.status) {
      res.locals.license = license;
      return next();
    }
  } catch (err) {
    return next(err);
  }

  res.clearCookie('sharing-image-premium', {
    path: '/sharing-image/licenses/',
  });
  return res.redirect('/sharing-image/licenses/login/');
});

router.get('/licenses/', async (req, res, next) => {
  if (!req.query.delete) {
    return next();
  }

  const license = res.locals.license;

  if (!req.query.nonce) {
    return res.redirect('/sharing-image/licenses/?message=1');
  }

  const action = `sharing-image-${req.query.delete}`;

  if (!nonce.verify(req.query.nonce, license.key, action)) {
    return res.redirect('/sharing-image/licenses/?message=1');
  }

  try {
    const destroy = await host.destroy({
      where: {
        id: req.query.delete,
        keyId: license.id,
      },
    });

    if (!destroy) {
      return res.redirect('/sharing-image/licenses/?message=2');
    }
  } catch (err) {
    return next(err);
  }

  return res.redirect('/sharing-image/licenses/');
});

router.get('/licenses/', async (req, res, next) => {
  let hosts = [];

  try {
    const license = res.locals.license;

    hosts = await host.findAll({
      where: {keyId: license.id},
      raw: true,
    });

    hosts.forEach((host) => {
      host.nonce = nonce.create(license.key, `sharing-image-${host.id}`);
      host.created = new Date(host.createdAt).toLocaleString();
    });
  } catch (err) {
    return next(err);
  }

  let warning = null;

  switch (req.query.message) {
    case '1':
      warning = 'The security token is invalid or expired. Try again.';
      break;

    case '2':
      warning = 'Could not delete the domain, it may have been done earlier.';
      break;
  }

  res.locals.meta = {
    title: 'Sharing Image',
    description: 'Description',
    url: '/sharing-image/licenses/',
  };

  res.render('pages/sharing-image/licenses', {
    hosts: hosts,
    warning: warning,
  });
});

router.post('/verify/', async (req, res) => {
  if (!req.body.key) {
    return res.answer(false, 400);
  }

  if (!req.body.domain) {
    return res.answer(false, 400);
  }

  try {
    const license = await key.findOne({
      where: {key: req.body.key},
      include: host,
    });

    if (null === license) {
      return res.answer(false, 400, 'KEY_NOT_FOUND');
    }

    if ('blocked' === license.status) {
      return res.answer(false, 400, 'KEY_BLOCKED');
    }

    if ('expired' === license.status) {
      return res.answer(false, 400, 'KEY_EXPIRED');
    }

    for (let i = 0; i < license.hosts.length; i++) {
      const domain = license.hosts[i].get('domain');

      if (domain === req.body.domain) {
        return res.answer();
      }
    }

    if (license.hosts.length >= license.limit) {
      return res.answer(false, 400, 'LIMIT_EXCEEDED');
    }

    await host.create({
      domain: req.body.domain,
      ip: req.clientIp,
      keyId: license.id,
    });
  } catch (err) {
    return res.answer(false, 500, 'SERVER_ERROR');
  }

  return res.answer();
});

module.exports = router;

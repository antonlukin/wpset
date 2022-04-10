const express = require('express');
const router = new express.Router();

const nonce = require('../utils/nonce');
const randomizer = require('../utils/randomizer');
const mailer = require('../utils/mailer');
const validator = require('email-validator');
const models = require('../models');
const {key, host} = models['sharing-image'];

/**
 * Show index page
 */
router.get('/', (req, res) => {
  let message = {};

  switch (req.query.message) {
    case '1':
      message = {
        title: 'The Premium license key has been successfully sent to your email.',
        class: 'success',
      };

      break;

    case '2':
      message = {
        title: 'The entered email looks incorrect. Try another one.',
        class: 'error',
      };

      break;

    case '3':
      message = {
        title: 'The entered email address already registered.',
        class: 'error',
      };

      break;

    case '4':
      message = {
        title: 'Failed to send email. Try again later.',
        class: 'error',
      };
  }

  res.locals.meta = {
    title: 'Sharing Image',
    description: 'WordPress plugin for generating sharing posters in social networks. Allows you to use text, watermarks and various filters.',
    url: '/sharing-image/',
  };

  res.render('pages/sharing-image/index', {
    message: message,
  });
});

/**
 * Show hooks page
 */
router.get('/hooks/', (req, res) => {
  res.locals.meta = {
    title: 'Sharing Image: hooks',
    description: 'The plugin provides developers with a large number of hooks that can be used to change its the behavior.',
    url: '/sharing-image/hooks/',
  };

  res.render('pages/sharing-image/hooks');
});

/**
 * Authenticate license
 */
router.post('/licenses/login/', async (req, res, next) => {
  if (!req.body.key) {
    return res.redirect('/sharing-image/licenses/login/');
  }

  try {
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
  } catch (err) {
    return next(err);
  }

  res.cookie('sharing-image-premium', req.body.key, {
    maxAge: 604800000,
    path: '/sharing-image/licenses/',
    httpOnly: true,
  });

  res.redirect('/sharing-image/licenses/');
});

/**
 * Show message on invaild login
 */
router.get('/licenses/login/', async (req, res) => {
  if (req.cookies['sharing-image-premium']) {
    return res.redirect('/sharing-image/licenses/');
  }

  let message = {};

  switch (req.query.message) {
    case '1':
      message = {
        title: 'The premium key is invalid.',
        class: 'error',
      };

      break;

    case '2':
      message = {
        title: 'The premium key was blocked.',
        class: 'error',
      };

      break;

    case '3':
      message = {
        title: 'The premium key is expired.',
        class: 'error',
      };

      break;
  }

  res.locals.meta = {
    title: 'Sharing Image',
    description: 'Tool for managing your access key to the premium Sharing Image plugin features.',
    url: '/sharing-image/licenses/login/',
  };

  res.render('pages/sharing-image/login', {
    message: message,
  });
});

/**
 * Logout license
 */
router.post('/licenses/logout/', async (req, res) => {
  res.clearCookie('sharing-image-premium', {
    path: '/sharing-image/licenses/',
  });
  res.redirect('/sharing-image/licenses/login/');
});

/**
 * Authorize license
 */
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

/**
 * Delete host license
 */
router.get('/licenses/', async (req, res, next) => {
  if (!req.query.delete) {
    return next();
  }

  const license = res.locals.license;

  if (!req.query.nonce) {
    return res.redirect('/sharing-image/licenses/?message=2');
  }

  const action = `sharing-image-${req.query.delete}`;

  if (!nonce.verify(req.query.nonce, license.key, action)) {
    return res.redirect('/sharing-image/licenses/?message=2');
  }

  try {
    const destroy = await host.destroy({
      where: {
        id: req.query.delete,
        keyId: license.id,
      },
    });

    if (!destroy) {
      return res.redirect('/sharing-image/licenses/?message=3');
    }
  } catch (err) {
    return next(err);
  }

  return res.redirect('/sharing-image/licenses/?message=1');
});

/**
 * Show licenses list
 */
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

  let message = {};

  switch (req.query.message) {
    case '1':
      message = {
        title: 'The domain successfully deleted.',
        class: 'success',
      };

      break;

    case '2':
      message = {
        title: 'The security token is invalid or expired. Try again.',
        class: 'error',
      };

      break;

    case '3':
      message = {
        title: 'Could not delete the domain, it may have been done earlier.',
        class: 'error',
      };

      break;
  }

  res.locals.meta = {
    title: 'Sharing Image',
    description: 'Tool for managing your access key to the premium Sharing Image plugin features.',
    url: '/sharing-image/licenses/',
  };

  res.render('pages/sharing-image/licenses', {
    hosts: hosts,
    message: message,
  });
});

/**
 * Verify remote request
 */
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


router.post('/registration/', async (req, res, next) => {
  if (!req.body.email) {
    return res.redirect('/sharing-image/');
  }

  if (!validator.validate(req.body.email)) {
    return res.redirect('/sharing-image/?message=2');
  }

  try {
    const license = await key.findOne({
      where: {email: req.body.email},
    });

    if (license) {
      return res.redirect('/sharing-image/?message=3');
    }

    const random = randomizer();

    const params = {
      from: process.env.MAILGUN_FROM,
      to: req.body.email,
      subject: 'Sharing Image Premium license key',
    };

    await mailer('sharing-image/registration', params, {
      key: random,
    });

    await key.create({
      key: random,
      limit: 5,
      email: req.body.email,
      status: 'valid',
    });
  } catch (err) {
    return res.redirect('/sharing-image/?message=4');
  }

  res.redirect('/sharing-image/?message=1');
});

module.exports = router;

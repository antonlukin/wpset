'use strict';

const md5 = require('md5');

/**
 * Lifespan of nonces in seconds.
 *
 * @param {Number} lifespan Minimum nonce lifespan.
 */
const lifespan = 3600;

/**
 * Get nonce tick relative for current timestamp.
 * @return {Number}
 */
const getNonceTick = () => {
  return Math.ceil(Date.now() / 1000 / lifespan);
};

/**
 * Create unique nonce for current user and action.
 *
 * @param {String} user User session.
 * @param {String} action Unique action name.
 * @return {String}
 */
const createNonce = (user, action) => {
  return md5(user + action + getNonceTick()).substring(0, 10);
};

/**
 * Verifies that a correct security nonce was used with time limit.
 *
 * @param {String} nonce Nonce value that was used for verification.
 * @param {String} user User session.
 * @param {String} action Unique action name.
 * @return {Boolean}
 */
const verifyNonce = (nonce, user, action) => {
  const tick = getNonceTick();

  if (typeof nonce !== 'string') {
    return false;
  }

  let expected = md5(user + action + tick).substring(0, 10);

  if (expected === nonce) {
    return true;
  }

  expected = md5(user + action + (tick - 1)).substring(0, 10);

  if (expected === nonce) {
    return true;
  }

  return false;
};

module.exports = {
  create: createNonce,
  verify: verifyNonce,
};

module.exports = (length = 12, group = 4) => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

  let key = '';
  for (let i = 0; i < length; i++) {
    const char = alphabet[Math.floor(Math.random() * alphabet.length)];

    if (i && i % group === 0) {
      key = key + '-';
    }

    key = key + char;
  }

  return key;
};

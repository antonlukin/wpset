const fs = require('fs');
const path = require('path');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);

module.exports = async (template, params, replacements) => {
  const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });

  const source = path.join(__dirname, '/../views/emails', template);
  params.text = fs.readFileSync(source + '.txt', 'utf-8');

  for (const key in replacements) {
    if (replacements.hasOwnProperty(key)) {
      params.text = params.text.replace(`%${key}%`, replacements[key]);
    }
  }

  return client.messages.create(process.env.MAILGUN_HOST, params);
};

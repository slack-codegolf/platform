'use strict';
const fetch = require('node-fetch');
const execURL = process.env.GOLF_URL;

const Golf = {
  // https://api.slack.com/docs/message-formatting#how_to_escape_characters
  unformat: (code) => code.replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&'),
  exec: (json) => fetch(execURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: json,
  }).then((res) => {
    return res.json(); // {success, out}
  }),
};

module.exports = Golf;

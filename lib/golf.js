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
    timeout: 30 * 1000, // heroku rule: https://devcenter.heroku.com/articles/request-timeout
  }).then((res) => {
    return res.json(); // {success, out}
  }).catch((err) => {
    let out = '';
    if (err.type === 'request-timeout')
      out = 'ERROR: TIMEOUT\nOver 30s';
    else
      out = 'ERROR: PLEASE INFORM @darai0512 OF THIS';
    return {success: false, out};
  }),
};

module.exports = Golf;

'use strict';
const fs = require('fs');
const cps = require('child_process');
const Puid = require('puid');

const puid = new Puid(true);

const Golf = {
  // https://api.slack.com/docs/message-formatting#how_to_escape_characters
  unformat: (code) => code.replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&'),
  exec: (inOuts, lang, code) => {
    const codeId = puid.generate();
    fs.mkdirSync(`input/${codeId}`);
    fs.mkdirSync(`answer/${codeId}`);
    // fs.chmodSync('answer', '0700')
    fs.writeFileSync(`input/${codeId}/code`, code);

    for (let i = 1; i <= inOuts.length; i++) {
      const {input, output} = inOuts[Math.floor(Math.random() * inOuts.length)];
      fs.writeFileSync(`input/${codeId}/hole${i}`, input);
      fs.writeFileSync(`answer/${codeId}/hole${i}`, output);
    }

    const env = `LANG="${lang}" CODEID="${codeId}" `;
    const command = 'bash ./task.sh';

    let success = true;
    try {
      cps.execSync(env + command);
    } catch (e) {
      success = false;
    }
    const out = fs.readFileSync(`output/${codeId}`, 'utf8');
    fs.unlink(`output/${codeId}`, (err) => console.error(err));

    return {success, out};
  },
};

module.exports = Golf;

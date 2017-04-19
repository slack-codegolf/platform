'use strict';

const slack = require('@slack/client');
const Redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(Redis.RedisClient.prototype);

const rank = require('./lib/rank');
const golf = require('./lib/golf');

const problems = require('./conf/problem');
const versions = require('./conf/version');
const help = require('./conf/help');

// connect slack
const rtm = new slack.RtmClient(process.env.SLACK_BOT_TOKEN || '');
rtm.on(slack.CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(`connecting as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});
rtm.on(slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('connected');
});
rtm.start();

// connect Redis
// @TODO Please change the DB file every contest
const redis = Redis.createClient(process.env.REDIS_URL, {no_ready_check: true});
redis.once('error', (err) => {
  !!redis && redis.quit();
  console.log(err);
});
redis.auth(process.env.REDIS_PASSWD);


// Before Exit
process.on('SIGINT', () => {
  // 終了処理
  !!redis && redis.quit();
  process.exit(0);
});
// UnhandledError

// main
const post = (msg, channel, wait) => {
  // if (wait) setTimeout(() => rtm.sendMessage(msg, channel), 1000);
  rtm.sendMessage(msg, channel);
};

/*
 * slack.RTM_EVENTS.IM_CREATED: data = {
 *   type: 'im_created',
 *   user: 'USER_ID_A',
 *   channel: {
 *     id: 'CHANNEL_ID',
 *     created: 1492140914,
 *     is_im: true,
 *     is_org_shared: false,
 *     user: 'USER_ID_A',
 *     last_read: '0000000000.000000',
 *     latest: null,
 *     unread_count: 0,
 *     unread_count_display: 0,
 *     is_open: false
 *   },
 *   event_ts: '1492140914.086374'
 * }
*/
rtm.on(slack.RTM_EVENTS.IM_CREATED, (data) => {
  post('Welcome to CodeGolf!!!\n\n' + help, data.channel.id, true);
});

const general = process.env.SLACK_GENERAL_CHANNEL;
const version = Object.keys(versions).map((lang) => `${lang}: ${versions[lang]}`).join('\n');

/*
 * @param {Object} wsMsg
 *    = { type, channel, user, text, ts, source_team, team }
**/
const onDirectMessage = function* (wsMsg) {
  const {text: msg, channel, user: userId, type} = wsMsg;
  if (channel === general ||
    type !== 'message' ||
    typeof msg !== 'string') return;

  let m = msg.match(/^(バージョン|version|v)\s*$/);
  if (m)
    return post(version, channel, true);

  m = msg.toLowerCase().match(/^(?:問題|problem|q)\s*([0-9]*)\s*$/);
  if (m) {
    const i = parseInt(m[1], 10);
    let res;
    if (problems[i]) {
      res = `*Q${i}. ${problems[i].title}*\n${problems[i].desc}`;
      return post(res, channel, true);
    } else {
      res = '*Questions*\n';
      for (const q of Object.keys(problems)) {
        res += `Q${q}. ${problems[q].title}\n`;
      }
      res += 'Show details: `q 1`';
      return post(res, channel, true);
    }
  }

  m = msg.toLowerCase().match(/^(?:スコア|score|s)\s*([a-z\-]*)\s*$/);
  if (m) {
    const userName = m[1] || rtm.dataStore.getUserById(userId).name;
    let res = '';
    for (const q of Object.keys(problems)) {
      res += `*Q${q}. ${problems[q].title}*\n`;
      let langMsg = '';
      for (const lang of Object.keys(versions)) {
        const score = yield redis.zscoreAsync(q + lang, userName);
        if (score) {
          const userAndScoreAsc = yield redis.zrangebyscoreAsync(q + lang, 1, '(' + score, 'WITHSCORES');
          langMsg += `  ${lang} ${score}B (${rank.showNumber(rank.next(userAndScoreAsc))})\n`;
        }
      }
      if (langMsg === '')
        res += 'None\n\n';
      else
        res += langMsg;
    }
    return post(res, channel, true);
  }

  m = msg.toLowerCase().match(/^(?:ランキング|ranking|r)\s*([0-9]+)\s*$/);
  if (m) {
    let q = parseInt(m[1], 10);
    if (problems[q]) {
      let res = `*Ranking  Q${q}. ${problems[q].title}*\n`;
      for (const lang of Object.keys(versions)) {
        const userAndScoreAsc = yield redis.zrangeAsync(q + lang, 0, -1, 'WITHSCORES');
        if (userAndScoreAsc.length === 0) continue;
        res += `*${lang}*\n` + rank.showRank(userAndScoreAsc);
      }
      return post(res, channel, true);
    } else
      return post('Question not found.', channel, true);
  }

  m = msg.toLowerCase().match(/^(?:ランキング|ranking|r)\s*([a-z+]+)\s*$/);
  if (m) {
    const reqLang = m[1].toLowerCase();
    let res = '';
    for (const lang of Object.keys(versions)) {
      if (reqLang !== lang && reqLang !== 'all') continue;
      if (reqLang === 'all')
        res += '\n';
      let part = '';
      const totalScoreOf = {};
      res += `*Ranking ${lang}*\n*Total Score*\n`;
      for (let q = 1; q <= Object.keys(problems).length; q++) {
        const userAndScoreAsc = yield redis.zrangeAsync(q + lang, 0, -1, 'WITHSCORES');
        // rank total question
        rank.setTotalScore(totalScoreOf, userAndScoreAsc, q);
        // rank every question
        part += `*Q${q}. ${problems[q].title}*\n` + rank.showRank(userAndScoreAsc);
      }
      res += rank.showTotalRank(totalScoreOf) + part;
    }
    return post(res, channel, true);
  }

  // input
  m = msg.match(/^([0-9]+)\s+([a-zA-Z+]+)\s*[\n\r]```[\s\n\r]*([\w\W]+?)[\n\r]?```/);
  if (!m)
    return post(help, channel, true);

  const q = parseInt(m[1], 10);
  const lang = m[2].toLowerCase();
  const code = golf.unformat(m[3]);

  if (!problems[q])
    return post('Not found the question', channel, true);

  if (Object.keys(versions).indexOf(lang) === -1)
    return post(`Not compatible language. Only the following one.\n${version}`, channel, true);

  // exec docker task
  // @TODO manage task by queue
  const inOuts = yield redis.getAsync(`q${q}`);
  const {success, out} = golf.exec(JSON.parse(inOuts), lang, code);
  const score = Buffer.byteLength(code, 'utf8');
  post([
    success ? 'Success :o:' : 'Failure :x:',
    `  Q${q}. ${problems[q].title}`,
    `  Language: ${lang}`,
    `  size: ${score}B`,
    '```',
    out + '```',
  ].join('\n'), channel, false);

  if (success) {
    const userName = rtm.dataStore.getUserById(userId).name;
    const preScore = yield redis.zscoreAsync(q + lang, userName);
    if (preScore && score - preScore >= 0)
      return;

    // update score
    yield redis.zaddAsync(q + lang, score, userName);

    let res = '';
    // check if update rank
    const userAndScoreAsc = yield redis.zrangeAsync(q + lang, 0, -1, 'WITHSCORES');
    let rankMsg = rank.showRank(userAndScoreAsc);
    if (rankMsg.indexOf(rank.showUser(userName)) !== -1) // update rank
      res += `*Q${q}. ${problems[q].title} (${lang}) Update Ranking!!* by @${userName}\n` + rankMsg;

    if (res !== '')
      res += '\n';

    // check if update total rank
    const totalScoreOf = {};
    rank.setTotalScore(totalScoreOf, userAndScoreAsc, 1);
    for (let otherQ = 1; otherQ <= Object.keys(problems).length; otherQ++) {
      if (q === otherQ) continue;
      const userAndScoreAsc = yield redis.zrangeAsync(otherQ + lang, 0, -1, 'WITHSCORES');
      rank.setTotalScore(totalScoreOf, userAndScoreAsc, 2);
    }
    rankMsg = rank.showTotalRank(totalScoreOf);
    if (rankMsg.indexOf(rank.showUser(userName)) !== -1) // update total rank
      res += `*Total Score (${lang}) Update Ranking!!* by @${userName}\n` + rankMsg;

    post(res, general, false);
  }
};

rtm.on(slack.RTM_EVENTS.MESSAGE, (wsMsg) => {
  bluebird.coroutine(onDirectMessage)(wsMsg).catch((err) => {
    console.error('[Internal Server Error] ' + err.stack);
  });
});

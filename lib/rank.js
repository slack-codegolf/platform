'use strict';
const userDelim = ' ';

const Rank = {
  showNumber: (rank) => {
    switch (rank) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return rank + 'th';
    }
  },

  // @TODO difficult to display user icons...
  showUser: (user) => `@${user}`,

  // @param {Array} zrangeWithScores - i: odd -> v: member, i: even -> v: score. ordered by score.
  next: (zrangeWithScores) => {
    let preScore = 0;
    let count = 1;
    for (const [i, v] of zrangeWithScores.entries()) {
      if (i % 2 === 1 && preScore !== v) {
        preScore = v;
        count++;
      }
    }
    return count;
  },

  _setRank: (rank, score, user) => {
    if (rank[score])
      rank[score] += userDelim + Rank.showUser(user);
    else
      rank[score] = Rank.showUser(user);
  },

  // @param {Array} zrangeWithScores - i: odd -> v: member, i: even -> v: score. ordered by score.
  showRank: (zrangeWithScores) => {
    const rank = {};
    let user;
    for (const [i, v] of zrangeWithScores.entries()) {
      if (i % 2 === 0)
        user = v;
      else if (Object.keys(rank).length < 5)
        Rank._setRank(rank, v, user);
      else
        break;
    }
    let msg = '';
    for (const [i, score] of Object.keys(rank).entries())
      msg += `  ${Rank.showNumber(i + 1)}: ${rank[score]} ${score}B\n`;
    return msg === '' ? 'None\n' : msg;
  },

  /*
   * @param {Object} totalScoreOf - to set total score by user
   * @param {Array} zrangeWithScores - i: odd -> v: member, i: even -> v: score. ordered by score.
   * @param {Number} callNum - call count of this function
   */
  setTotalScore: (totalScoreOf, zrangeWithScores, callNum) => {
    const users = [];
    for (const [i, v] of zrangeWithScores.entries()) {
      if(i % 2 === 0) {
        users.unshift(v);
      } else {
        let score = Number(v);
        let user = users[0];
        if (totalScoreOf[user])
          totalScoreOf[user] += score;
        else if (callNum === 1)
          totalScoreOf[user] = score;
      }
    }
    for (const user of Object.keys(totalScoreOf)) {
      if (users.indexOf(user) === -1)
        delete totalScoreOf[user];
    }
  },

  /*
   * @param {Object} totalScoreOf - to set total score by user
   * @return {String} msg
   */
  showTotalRank: (totalScoreOf) => {
    const rank = {};
    for (const user of Object.keys(totalScoreOf))
      Rank._setRank(rank, totalScoreOf[user], user);
    let msg = '';
    for (const [i, score] of Object.keys(rank).sort((a, b) => a - b).entries()) {
      if (i === 5) break;
      msg += `  ${Rank.showNumber(i+1)}: ${rank[score]} ${score}B\n`;
    }
    return msg === '' ? 'None\n' : msg;
  },
};

module.exports = Rank;

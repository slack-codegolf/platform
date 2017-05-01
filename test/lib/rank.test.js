const {
  showNumber,
  showUser,
  next,
  _setRank,
  showRank,
  setTotalScore,
  showTotalRank,
} = require('../../lib/rank');
const test = require('ava');

test('showNumber', (t) => {
	t.is(showNumber(1), '1st');
	t.is(showNumber(2), '2nd');
	t.is(showNumber(3), '3rd');
	t.is(showNumber(10), '10th');

	t.not(showNumber(1), '1th');
});

test('next', (t) => {
  let zrangeWithScores = [];
	t.is(next(zrangeWithScores), 1);
  zrangeWithScores = [
    'a', 10, 'b', 20, 'c', 20, 'd', 25, 'e', 25, 'f', 25, 'g', 27, 'h', 30, 'i', 100,
  ];
	t.is(next(zrangeWithScores), 7);
});

test('showUser', (t) => {
	t.is(showUser('darai0512'), '@darai0512');
});

test('_setRank', (t) => {
  const rank = {};
  _setRank(rank, 10, 'fmy');
	t.deepEqual(rank, {10: '@fmy'});
  _setRank(rank, 20, 'darai0512');
	t.deepEqual(rank, {10: '@fmy', 20: '@darai0512'});
  _setRank(rank, 10, 'espressivo');
	t.deepEqual(rank, {10: '@fmy @espressivo', 20: '@darai0512'});
});

test('showRank', (t) => {
  let zrangeWithScores = [];
	t.is(showRank(zrangeWithScores), 'None\n');
  zrangeWithScores = [
    'a', 10, 'b', 20, 'c', 20, 'd', 25, 'e', 25, 'f', 25, 'g', 27, 'h', 30, 'i', 100,
  ];
	t.is(showRank(zrangeWithScores),
    '  1st: @a 10B\n' +
    '  2nd: @b @c 20B\n' +
    '  3rd: @d @e @f 25B\n' +
    '  4th: @g 27B\n' +
    '  5th: @h 30B\n'
  );
});

test('setTotalScore and showTotalRank', (t) => {
  const totalScoreOf = {};
  let zrangeWithScores = [];
  setTotalScore(totalScoreOf, zrangeWithScores, 1);
	t.deepEqual(totalScoreOf, {});

  zrangeWithScores = [
    'a', 10, 'b', 20, 'c', 20, 'd', 25, 'e', 25, 'f', 25, 'g', 27, 'h', 30, 'i', 100,
  ];
  setTotalScore(totalScoreOf, zrangeWithScores, 2);
	t.deepEqual(totalScoreOf, {});

  zrangeWithScores = [
    'a', 10, 'b', 20, 'c', 20, 'd', 25, 'e', 25, 'f', 25, 'g', 27, 'h', 30, 'i', 100,
  ];
  setTotalScore(totalScoreOf, zrangeWithScores, 1);
	t.deepEqual(totalScoreOf, {
    a: 10,
    b: 20,
    c: 20,
    d: 25,
    e: 25,
    f: 25,
    g: 27,
    h: 30,
    i: 100,
  });

  zrangeWithScores = [
    'i', 10, 'j', 10, 'a', 15, 'b', 20, 'c', 20, 'd', 25, 'e', 30, 'f', 100,
  ];
  setTotalScore(totalScoreOf, zrangeWithScores, 2);
	t.deepEqual(totalScoreOf, {
    a: 25,
    b: 40,
    c: 40,
    d: 50,
    e: 55,
    f: 125,
    i: 110,
  });

	t.is(showTotalRank(totalScoreOf),
    '  1st: @a 25B\n' +
    '  2nd: @b @c 40B\n' +
    '  3rd: @d 50B\n' +
    '  4th: @e 55B\n' +
    '  5th: @i 110B\n'
  );

  setTotalScore(totalScoreOf, [], 3);
	t.deepEqual(totalScoreOf, {});
	t.is(showTotalRank(totalScoreOf), 'None\n');
});

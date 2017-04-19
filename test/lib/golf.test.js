const {
  unformat,
} = require('../../lib/golf');
const test = require('ava');

test('showNumber', (t) => {
	t.is(unformat('#include&lt;stdio.h&gt;'), '#include<stdio.h>');
	t.is(unformat('i=5;console.log(i&amp;1&gt;&gt;&gt;1)'), 'i=5;console.log(i&1>>>1)');
});

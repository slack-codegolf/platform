'use strict';

module.exports = {
  1: {
    title: 'Hello World!',
    desc: `Output "Hello World!".
"Hello World!"を出力して下さい

input:
None

output:
\`\`\`
Hello World!
\`\`\``,
  },
  2: {
    title: 'Ascii Art',
    desc: `Sum up decimal Ascii number of input.
入力のアスキーコードに対応する10進数を足し上げて下さい

input:
\`\`\`
 /\\___/\\
( ' tj ')
(.      .)
 |  |  |
(___).___)\`\`\`

output:
\`\`\`
2747
\`\`\``,
  },
  3: {
    title: 'Degi2Ana',
    desc: `Convert the input's digital "YYYYMMDD" date to analog one.
与えられたデジタルの日付("YYYYMMDD" format)をアナログ形式で出力して下さい
\`\`\`
###   # ### ### # # ### #   ### ### ###
# #   #   #   # # # #   #   # # # # # #
# #   # ### ### ### ### ###   # ### ###
# #   # #     #   #   # # #   # # #   #
###   # ### ###   # ### ###   # ### ###
\`\`\`

input:
\`\`\`
### ###   # ### ### # # ###   #
  # # #   # # # # # # # # #   #
### # #   #   # # # ### # #   #
#   # #   #   # # #   # # #   #
### ###   #   # ###   # ###   #\`\`\`

output:
\`\`\`
2017/4/1
\`\`\``,
  },
};

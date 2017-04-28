'use strict';

module.exports = {
  1: {
    title: 'Hello World!',
    owner: 'fmy',
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
    owner: 'darai0512',
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
    title: 'Count down',
    owner: 'fmy',
    desc: `Count down from an input's natural number.
inputの自然数からカウントダウンして下さい。

input:
\`\`\`
3\`\`\`

output:
\`\`\`
3 ...
2 ...
1 ...
Boom!
\`\`\``,
  },
  4: {
    title: 'Palindrome',
    owner: 'fmy',
    desc: `Make the shortest palindrome by adding 0 or more characters after input's alphabet.
inputのアルファベット文字列の後ろに0文字以上の文字列を加えて最短の回文を作って下さい。

input:
\`\`\`
Hall\`\`\`

output:
\`\`\`
HallaH
\`\`\``,
  },
  5: {
    title: 'Baseball',
    owner: 'espressivo',
    desc: `Output the current game score delimited by space from results for each batting of the single line input.
各打席の結果を表す1行のinputからその時点での両者の点数をスペース区切りで出力して下さい。
\`\`\`
# Input format
0=Out
1=one-base hit
2=two-base hit
3=three-base hit
4=Home run

# Rule
- No delimiter of three-out change. (3アウトチェンジの区切りはありません)
- Runners advance by the same amount as the hitter's base. (走者は打者の進塁と同じだけ進塁します)
- Don't consider the other rules such as four balls. (フォアボール等はないものとします)
\`\`\`

input:
\`\`\`
130102004002\`\`\`

output:
\`\`\`
2 1
\`\`\``,
  },
  6: {
    title: 'digital clock',
    owner: 'fmy http://golf.shinh.org/p.rb?digital+clock',
    desc: `Convert the input's analog time to digital one.
与えられた時間をデジタル時計風に表示してください。
\`\`\`
    ###   # ### ### # # ### #   ### ### ###
 #  # #   #   #   # # # #   #   # # # # # #
    # #   # ### ### ### ### ###   # ### ###
 #  # #   # #     #   #   # # #   # # #   #
    ###   # ### ###   # ### ###   # ### ###
\`\`\`

input:
\`\`\`
7:41\`\`\`

output:
\`\`\`
### ###     # #   #
# # # #  #  # #   #
# #   #     ###   #
# #   #  #    #   #
###   #       #   #
\`\`\``,
  },
  7: {
    title: 'Degi2Ana',
    owner: 'darai0512',
    desc: `Convert the input's digital "YYYYMMDD" date to analog one.
与えられたデジタルの日付("YYYYMMDD" format)をアナログ風に出力して下さい
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

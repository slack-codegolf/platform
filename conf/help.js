'use strict';

module.exports = `*HELP*
Show languages (プログラミング言語一覧を見る)
> v
Show a question No.1 (問題1を見る)
> q 1
Show the ranking of question No.1 (問題1のランキングを見る)
> r 1
Show all questions' ranking of node (nodeのランキングを見る)
> r node
Show your scores (自分のスコア一覧を見る)
> s
Answer question No.1 by java (問題1をjavaで回答する)
> 1 java
> \`\`\`
public class Main{
  public static void main(String[] args){
    System.out.print("Write your code like this");
  }
}
\`\`\`
*Note*: java, c and cpp are compiled as Main.java, main.c and main.cpp, respectively.
*Rule1*: pass 3 tests within 30s.
*Rule2*: exit status must be 0.`;

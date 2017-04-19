#!/bin/bash

set -ex

PWD=$(pwd)
CODE="code"
INDIR="input/${CODEID}"
OUTPUT="${PWD}/output/${CODEID}"
ANSDIR="${PWD}/answer/${CODEID}"
#TRACE="${PWD}/output/tracefile"

clean() {
  rm -rf ../../$INDIR $ANSDIR
}

#chown operator:root $INDIR
cd $INDIR

echo "### TESTS START BY ${LANG}." > $OUTPUT
# ifconfig $(ifconfig | fgrep encap:Ethernet | awk '{print $1}') down
case "${LANG}" in
  "c")
    mv $CODE main.c
    gcc main.c
    COMMAND="./a.out"
    ;;
  "cpp")
    mv $CODE main.cpp
    g++ main.cpp
    COMMAND="./a.out"
    ;;
#  "go")
#    mv $CODE main.go
#    go build main.go
#    COMMAND="./main"
#    ;;
  "java")
    mv $CODE Main.java
    javac Main.java
    COMMAND="java Main"
    ;;
  *)
    COMMAND="${LANG} $CODE"
esac

for file in `ls -1 hole*`
do
  echo "$ ${COMMAND} < $file" >> $OUTPUT
  ans=$(cat "${ANSDIR}/$file")
  # out=$(su operator -c "strace -f -e execve $COMMAND < ${INPUT}/$file" 2>> $TRACE)
  out=$(${COMMAND} < $file)

  if [ "$out" != "$ans" ]
  then
    echo "NG (~_~);" >> $OUTPUT
    clean
    exit 1
  fi
  echo "OK (^_^)v" >> $OUTPUT
done

## check for execve
# process=$(fgrep execve $TRACE | fgrep pid | wc -l)
# if [ "$LANG" != "bash" ] && [ $process -ne 0 ]
# then
#   echo "!!! DO NOT USE EXTERNAL COMMAND !!!" >> $OUTPUT
#   exit 1
# fi

echo "ALL TESTS PASSED!!!" >> $OUTPUT
clean

exit 0

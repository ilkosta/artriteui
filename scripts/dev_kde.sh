#!/bin/sh

prjhome=$PWD
TE="konsole --new-tab --workdir $PWD"
#TE=xterm

#export DEBUG=express:*
export NODE_ENV=development

# controllo il server
ps ax | grep mysql | grep -v grep | grep -v akonadi >/dev/null 2>/dev/null || sudo service mysql start

npm install
bower install
ps ax | grep brunch | grep -v grep >/dev/null 2>/dev/null || $TE -e brunch w &

cd server
npm install
ps ax | grep node-inspector | grep -v grep >/dev/null 2>/dev/null ||  node-inspector &

ps ax | grep protractor | grep -v grep >/dev/null 2>/dev/null ||  $TE -e sh ../scripts/test_e2e.sh 5 &

DEBUG=express:* node-dev --debug server.js



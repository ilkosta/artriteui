#!/bin/sh

prjhome=$PWD
#browser="chromium"
#export DEBUG=express:*
export NODE_ENV=development

#rm $prjhome/server/public 
#ln -s $prjhome/_public $prjhome/server/public
npm install
bower install
xterm -e "brunch w" &
#xterm -e "node app.js" &

cd server
npm install
ps | grep node-inspector || node-inspector &
DEBUG=express:* node-dev --debug server.js



#!/bin/sh

prjhome=$PWD
#browser="chromium"
#export DEBUG=express:*
export NODE_ENV=development

#rm $prjhome/server/public 
#ln -s $prjhome/_public $prjhome/server/public

xterm -e "brunch w -s" &
#xterm -e "node app.js" &

cd server
#node-inspector &
DEBUG=express:* node-dev --debug server.js



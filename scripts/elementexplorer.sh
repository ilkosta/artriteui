#!/bin/sh

webdriver-manager start &
sleep 6
node_modules/protractor/bin/elementexplorer.js http://localhost:3000/index.html
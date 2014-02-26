#!/bin/sh

echo "PWD=$PWD"

sleep 10

node_modules/protractor/bin/protractor test/protractor.conf.js

sleep 10
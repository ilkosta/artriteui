#!/bin/sh

sleep $1

cd ..

protractor test/protractor.conf.js

sleep 10
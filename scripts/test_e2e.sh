#!/bin/sh

sleep $1

# dalla dir `server`
cd ..

protractor test/protractor.conf.js

sleep 10
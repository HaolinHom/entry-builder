#!/usr/bin/env node

'use strict';

const commander = require('commander');
const packageJson = require('./package.json');

const build = require('./commander/build');

const entryBuilder = new commander
  .Command(packageJson.name)
  .version(packageJson.version)
  .action(build);

entryBuilder.parse(process.argv);
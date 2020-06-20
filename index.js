#!/usr/bin/env node

'use strict';

const commander = require('commander');
const packageJson = require('./package.json');

const build = require('./commander/build');
const create = require('./commander/create');

const entryBuilder = new commander
  .Command(packageJson.name)
  .version(packageJson.version)
  .action(build);

entryBuilder
  .command('create')
  .action(create);

entryBuilder.parse(process.argv);
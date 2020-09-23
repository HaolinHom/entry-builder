#!/usr/bin/env node

'use strict';

const commander = require('commander');
const packageJson = require('./package.json');

const build = require('./commander/build');
const create = require('./commander/create');

const entryBuilder = new commander
  .Command(packageJson.name)
  .version(packageJson.version)
  .option('-i, --input <dirPath>', 'Input directory')
  .option('-o, --output <filePath>', 'Single output file')
  .option('-f, --format <moduleType>', 'Module Type of output (es, cjs)')
  .action(build);

entryBuilder
  .command('create')
  .action(create);

entryBuilder.parse(process.argv);
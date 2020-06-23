/**
 * .entry-builder-config
 *
 * bash: entry-builder create
 * Description: An es module entry builder.
 * version: 0.0.1
 * */
module.exports = {
  entry: {
    path: './src',
  },
  output: {
    path: './',
    filename: 'index',
  },
  ignorePath: [
    './.git',
    './.idea',
  ],
};
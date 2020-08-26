/**
 * entry-builder
 * Description: Entry-builder is a tool can automatic generate es or node module's entry file.
 * Homepage: https://github.com/HaolinHom/entry-builder#readme
 * */
module.exports = {
  entry: {
    path: './src',
  },
  output: {
    path: './',
    filename: 'index',
  },
  moduleType: 'es',
  ignorePath: [
    './.git',
    './.idea',
  ],
};
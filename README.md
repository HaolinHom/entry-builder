# entry-builder

Entry-builder is a tool can automatic generate es module or commonjs's entry file.

Only support js file now.

## Installation

```bash
npm install entry-builder
```

## Usage

### build command

Generate entry file based on configuration file(.entry-builder-config.js).

```bash
entry-builder
```

#### run build with command line flags

```
-i, --input     Input directory
-o, --output    Single output file
-f, --format    Module Type of output (es, cjs)
```

```bash
entry-builder -i src -o index.js -f es
```

if `.entry-builder-config.js` is exist, command line flags will cover config file argument value.

### create command

Create config files manually.

```bash
entry-builder create
```

#### entry-builder-config

| argument | description | type | default |
|----|----|----|----|
| entry | resource entry | string | object | '' |
| entry.path | resource entry directory path | string | ''(e.g. './src') |
| output | output file | string | object | '' |
| output.path | output file path | string | ''(e.g. './') |
| output.filename | output file name | string | 'index' |
| moduleType | es-module or node-module | string | 'es' (or 'node') |
| ignorePath | ignore some directory or file in entry path | string? / array? | [] |
| ignoreFile | ignore some directory or file in entry path | string? / array? | [] |
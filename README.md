# entry-builder

Entry-builder is a tool can automatic generate es or node module's entry file.

Only support js file now.

## Installation

```bash
npm install entry-builder -g
```

## Usage

### build command

Generate entry file based on configuration file(entry-builder-config.js).

```bash
entry-builder
```

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
| ignorePath | ignore some directory or file in entry path | array? | [] |
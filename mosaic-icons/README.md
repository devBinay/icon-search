# SVG icons for Mosaic

This package provides sets of SVG icons from [Icons8](https://icons8.com/).

## Installation

```bash
npm install @advanced/mosaic-icons --save
```

**Please note**: Mosaic NPM packages are hosted on a private NPM registry with [Artifactory](https://advancedcsg.jfrog.io/advancedcsg/).
You will need to configure this before installing any Mosaic NPM package. Setup instructions are explained on the [Artifactory](https://advancedcsg.jfrog.io/advancedcsg/) website.

## Basic usage

See https://mosaic.oneadvanced.io/icons for usage and an icon search.

## Development

Commands to flatten directory structure from Icons8:

### Windows command

```bat
for /r %f in (*) do @copy "%f" .
```

### Bash

```sh
find . -type f -exec mv -i '{}' . ';'
```

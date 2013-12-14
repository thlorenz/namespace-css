# namespace-css [![build status](https://secure.travis-ci.org/thlorenz/namespace-css.png?branch=master)](http://travis-ci.org/thlorenz/namespace-css)

Namespaces all rules found in a CSS file to make them only apply to a subset of the page.

```
# namespace local file
namespace-css orig.css --selector .myclass -o namespaced.css

# pipe string into it to do things like
curl -L http://some.site.com/index.css | namespace-css -s .myclass
```

```js
var namespaceCss = require('namespaceCss');

fs.createReadStream(infile)
  .pipe(namespaceCss({ selector: '.myclass'}))
  .pipe(process.stdout)
```

## Installation

    npm install namespace-css

## Usage

```
usage: namespace-css [input.css] <options>

  Namespaces the css in the input file according to given options.

  If no input file is given stdin is used and if no output file is given results are piped to stdout.

OPTIONS:

  -s, --selector  css selector (any string) under which to namespace the rule in the input file
  -o, --out       output file to save namespaced css to (optional)

EXAMPLES:

  Namespace all rules in input.css under '.mynamespace' and save in output.css

    namespace-css input.css -s .mynamespace -o output.css

  Namespace all rules in input.css under 'article' and pipe resulting css to the terminal 

    namespace-css input.css -s article
```

## API

### namespaceCss(file, opts)

```js
/**
 * Transforms the piped css by namespacing it to given options.
 * 
 * @name namespaceCss
 * @function
 * @param {String=} file ignored (only here to match common transform signature)
 * @param {Options} opts 
 * @param {String}  opts.selector the selector under which to namespace all css rules
 * @return {TransformStream} the stream into which to pipe original css
 */
```

## License

MIT

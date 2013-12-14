#!/usr/bin/env node

'use strict';

var minimist     =  require('minimist')
  , path         =  require('path')
  , fs           =  require('fs')
  , namespaceCss =  require('../')

var argv = minimist(process.argv.slice(2)
  , { string: [ 'selector', 's', 'out', 'o' ] }
)
  
function usage(code) {
  var usageFile = path.join(__dirname, 'usage.txt');
  fs.createReadStream(usageFile).pipe(process.stdout);
}

var selector = argv.selector || argv.s
  , out = argv.out || argv.o
  , infile = argv._[0];

if (argv.h || argv.help) return usage(0);
if (!selector) return usage(1);

var outstream = out ? fs.createWriteStream(out, 'utf8') : process.stdout;
var instream = infile ? fs.createReadStream(infile) : process.stdin;

instream
  .pipe(namespaceCss({ selector: selector}))
  .pipe(outstream)

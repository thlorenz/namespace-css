'use strict';
/*jshint asi: true */

var test = require('tap').test
var namespace = require('../')
var fs = require('fs')
  , path = require('path')
  , fixtures = path.join(__dirname, 'fixtures')

function fail(err) {
  /* jshint validthis: true */
  this.fail(err);
  this.end();
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nsimple css with one rule', function (t) {
  var data = '';

  fs.createReadStream(path.join(fixtures, 'simple.css'), 'utf8')
    .on('error', fail.bind(t))
    .pipe(namespace({ selector: '.jsdoc' }))
    .on('error', fail.bind(t))
    .on('data', function (d) { data += d })
    .on('end', function () {
      var lines = data.split('\n');
//      inspect(lines);
      t.deepEqual(
          lines
        , [ '.jsdoc a {',
            '  color: \'green\';',
            '}' ]
      )
      t.end()
    })
})

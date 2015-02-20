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
      inspect(lines);
      t.deepEqual(
          lines
        , [ '.jsdoc a {',
            '  color: \'green\';',
            '}' ]
      )
      t.end();
    })
})

test('\nmultiple selectors per rule, two rules', function (t) {
  var data = '';

  fs.createReadStream(path.join(fixtures, 'multi-selectors-per-rule.css'), 'utf8')
    .on('error', fail.bind(t))
    .pipe(namespace({ selector: '.jsdoc' }))
    .on('error', fail.bind(t))
    .on('data', function (d) { data += d })
    .on('end', function () {
      var lines = data.split('\n');
      inspect(lines);
      t.deepEqual(
          lines
        , [ '.jsdoc nav h2 a,',
            '.jsdoc nav h2 a:visited {',
            '  text-decoration: none;',
            '}',
            '',
            '.jsdoc nav h2 a,',
            '.jsdoc nav h2 a:visited,',
            '.jsdoc div.hello {',
            '  text-decoration: none;',
            '}' ]
      )
      t.end();
    })
})

test('\nmultiple rules', function (t) {
  var data = '';

  fs.createReadStream(path.join(fixtures, 'multi-rules.css'), 'utf8')
    .on('error', fail.bind(t))
    .pipe(namespace({ selector: '.jsdoc' }))
    .on('error', fail.bind(t))
    .on('data', function (d) { data += d })
    .on('end', function () {
      var lines = data.split('\n');
      inspect(lines);
      t.deepEqual(
          lines
        , [ '.jsdoc html {',
            '  overflow: auto;',
            '}',
            '',
            '.jsdoc body {',
            '  font: 14px "DejaVu Sans Condensed", "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif;',
            '}',
            '',
            '.jsdoc a {',
            '  color: #444;',
            '}',
            '',
            '.jsdoc a:visited {',
            '  color: #444;',
            '}',
            '',
            '.jsdoc a:active {',
            '  color: #444;',
            '}',
            '',
            '.jsdoc header {',
            '  display: block;',
            '  padding: 6px 4px;',
            '}',
            '',
            '.jsdoc .class-description {',
            '  font-style: italic;',
            '}',
            '',
            '.jsdoc #main {',
            '  float: left;',
            '}',
            '',
            '.jsdoc section {',
            '  display: block;',
            '}',
            '',
            '.jsdoc .variation {',
            '  display: none;',
            '}',
            '',
            '.jsdoc .optional:after {',
            '  font-style: italic;',
            '  font-weight: lighter;',
            '}',
            '',
            '.jsdoc nav {',
            '  display: block;',
            '}',
            '',
            '.jsdoc nav ul {',
            '  line-height: 17px;',
            '}',
            '',
            '.jsdoc nav h2 a,',
            '.jsdoc nav h2 a:visited {',
            '  text-decoration: none;',
            '}',
            '',
            '.jsdoc nav h3 {',
            '  margin-top: 12px;',
            '}' ]
      )
      t.end();
    })

  test('\n don\'t namespace @fontface', function (t) {
    fs.createReadStream(path.join(fixtures, 'fontface.css'), 'utf8')
      .on('error', fail.bind(t))
      .pipe(namespace({ selector: '.jsdoc' }))
      .on('error', fail.bind(t))
      .on('data', function (d) { data += d })
      .on('end', function () {
        inspect(data);
        t.deepEqual(data
        , '@fontface {}');
      });
    t.end();
  });
})

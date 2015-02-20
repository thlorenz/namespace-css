'use strict';

var stream = require('stream');

var util      =  require('util')
  , parse     =  require('css-parse')
  , stringify =  require('css-stringify')
  , traverse  =  require('traverse')
  ;

var Transform = stream.Transform;

util.inherits(NamespaceCssTransform, Transform);

function NamespaceCssTransform (opts) {
  if (!(this instanceof NamespaceCssTransform)) return new NamespaceCssTransform(opts);

  opts = opts || {};
  Transform.call(this, opts);

  this.selector = opts.selector || process.env.NAMESPACE_CSS_SELECTOR;

  if (!this.selector) {
    throw new Error('Need to specify selector in opts or as NAMESPACE_CSS_SELECTOR environment variable');
  }
  
  this.origCss = '';
}

NamespaceCssTransform.prototype._transform = function (chunk, encoding, cb) {
  this.origCss += (encoding === 'buffer' ? chunk.toString() : chunk);
  cb();
}

NamespaceCssTransform.prototype._namespace = function (current) {
  return this.selector + ' ' + current;
}

NamespaceCssTransform.prototype._flush = function (cb) {
  var self = this;
  try {
    var parsed = parse(self.origCss);

    traverse.forEach(parsed, function (node) {
      if (this.key === 'selectors' && node != '@fontface') {
        this.update(node.map(self._namespace.bind(self)));
      }
    });

    self.push(stringify(parsed));
    cb()
  } catch (err) {
    cb(err);
  }

      
};

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
var go = module.exports = function namespaceCss(file, opts) {
  // allow file to stay compat with mutiny/catw/browserify transforms
  if (typeof file === 'object') {
    opts = file;
  }
  return new NamespaceCssTransform(opts);  
}

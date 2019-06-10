'use strict';

const path = require('path');
const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-cli-bootstrap-datepicker',

  included: function(app) {
    this._super.included(app);

    app.import(path.join(this.treePaths.vendor, 'bootstrap-datepicker.js'));
    app.import(path.join(this.treePaths.vendor, 'bootstrap-datepicker.css'));
  },

  treeForVendor(vendorTree) {
    let jsDir = path.dirname(require.resolve('bootstrap-datepicker'));
    let cssDir = path.resolve(jsDir, '..', 'css');
    let localesDir = path.resolve(jsDir, '..', 'locales');

    // If there's no vendor directory (it apparently get stripped if empty when
    // publishin to npm), the vendorTree is undefined and mergeTrees() gets
    // grumpy if one of the trees passed in isn't a broccoli node.
    let trees = [];
    if (vendorTree) {
      trees.push(vendorTree);
    }

    // Don't load the bootstrap-datepicker.js script if we're running under
    // Fastboot (due to the jQuery dependency)
    let bootstrap_datepicker_js = map(
      new Funnel(jsDir, { files: [ 'bootstrap-datepicker.js' ] }),
      (content) => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    trees.push(
      bootstrap_datepicker_js,
      new Funnel(cssDir, { files: [ 'bootstrap-datepicker.css' ] }),
      new Funnel(localesDir, { destDir: 'bootstrap-datepicker-locales' })
    );

    return mergeTrees(trees);
  }
};

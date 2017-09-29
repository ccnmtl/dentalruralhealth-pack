/* global describe: true, before: true */

require('!file-loader?name=[name].[ext]!./view-test.html');
require('../src/static.js');

var chai = require('chai');
var assert = chai.assert;

var jQuery = require('jquery');
var module = require('../src/ruralhealth.js');

describe('RuralHealthOfficeApp', function() {

    before(function() {
        var elt = jQuery('.rural-health-office');
        assert.isDefined(elt);
        jQuery(elt).html('');

        module.RuralHealthOfficeApp.initialize();
    });
});

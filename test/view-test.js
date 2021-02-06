/* global describe: true, before: true, it: true */
require('!file-loader?name=[name].[ext]!../test/view-test.html');

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

    describe('step1 interaction', function() {
        it('initialized', function() {
            assert.equal(jQuery('.btn-step').length, 6);
        });
    });
});

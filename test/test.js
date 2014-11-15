var assert = require('assert');
var should = require('should');
var MainpageJS = require('../mainpage.js');

describe('MainpageJS', function() {
    describe('define method', function() {
        it('must add components with unique string ids', function() {
            var mp = new MainpageJS();
            mp.define('AuthWidget', [], function() {
                return {};
            });
            mp.define('HeaderWidget', [], function() {
                return {};
            });
            mp._components.should.have.keys(['AuthWidget', 'HeaderWidget']);
        });

        it('must throw an exception when trying to add a component with existing id', function() {
            assert.throws(function() {
                var mp = new MainpageJS();
                mp.define('AuthWidget', [], function() {
                    return {};
                });
                mp.define('HeaderWidget', [], function() {
                    return {};
                });
                mp.define('AuthWidget', [], function() {
                    return {};
                });
            });
        });

        it('must not fail if we define components in random order', function() {

        });

        it('must throw an exception if dependency not found', function() {

        });

        it('must define a component with no dependencies if dependencies argument is missing', function() {

        });
    });
})
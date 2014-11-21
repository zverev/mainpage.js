var assert = require('assert');
var should = require('should');
var mp = require('../mainpage.js');

var adapter = {
    deferred: mp.deferred,
    resolved: function(value) {
        var d = mp.deferred();
        d.resolve(value);
        return d;
    },
    rejected: function(value) {
        var d = mp.deferred();
        d.reject(value);
        return d;
    }
};

describe("Promises/A+ Tests", function() {
    require("promises-aplus-tests").mocha(adapter);
});

describe('MainpageJS', function() {
    describe('define method', function() {
        it('must add components with unique string ids', function() {
            var mp = require('../mainpage.js');
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
                var mp = require('../mainpage.js');
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
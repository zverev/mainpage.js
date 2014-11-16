(function() {

    var Promise = function() {
        // null = pending
        // true = fulfilled
        // false = rejected
        this.promise = this;
        this._state = null;
        this._onResolve = function() {};
        this._onReject = function() {};
        this._done = false;
    };

    Promise.prototype.then = function(onResolve, onReject) {
        this._onResove = (typeof onResolve === 'function') && onResolve;
        this._onReject = (typeof onReject === 'function') && onReject;
        if (this._state === true && !this._done) {
            this._onResolve(this._onResolveArgs);
        }
        if (this._state === false && !this._done) {
            this._onReject(this._onRejectArgs);
        }
    };

    Promise.prototype.resolve = function(value) {
        if (this._state === null) {
            this._state = true;
            this._onResolve(value);
        } else {
            // call onResolve in then
            this._onResolveArgs = arguments;
        }
    };

    Promise.prototype.reject = function(value) {
        if (this._state === null) {
            this._state = false;
            this._onReject(value);
        } else {
            // call onReject in then
            this._onRejectArgs = arguments;
        }
    };

    // returns true if secondary array is subset of primary
    var isSubset = function(primary, secondary) {
        for (var i = 0; i < secondary.length; i++) {
            if (primary.indexOf(secondary[i]) === -1) {
                return false;
            }
        }
        return true;
    };

    var Mainpage = function() {
        this._components = {};
        this._createdComponentsIds = [];
        this._pendingComponentsIds = [];
    };

    // fill dependents array in each component
    Mainpage.prototype._computeDependents = function() {
        for (id in this._components) {
            if (this._components.hasOwnProperty(id)) {
                var dependencies = this._components[id].dependencies;
                for (var i = 0; i < dependencies.length; i++) {
                    var parentComponent = this._components[dependencies[i]];
                    if (parentComponent) {
                        parentComponent.dependents.push(id);
                    } else {
                        throw 'invalid dependency';
                    }
                }
            }
        }
    };

    // get components with no dependencies or with dependencies, 
    // that have allready been created
    Mainpage.prototype._getIndependentComponentsIds = function() {
        var independentComponentsIds = [];
        for (id in this._components) {
            if (this._components.hasOwnProperty(id)) {
                if (
                    (
                        (!this._components[id].dependencies.length) ||
                        isSubset(this._createdComponentsIds, this._components[id].dependencies)
                    ) &&
                    (this._createdComponentsIds.indexOf(id) === -1)
                ) {
                    independentComponentsIds.push(id);
                }
            }
        }
        return independentComponentsIds;
    };

    Mainpage.prototype._done = function(id, instance) {
        this._components[id].instance = instance;
        // add current component id to createdComponents list and remove from pendingComponents
        this._createdComponentsIds = this._createdComponentsIds.concat(
            this._pendingComponentsIds.splice(this._pendingComponentsIds.indexOf(id), 1)
        );
        if (!this._pendingComponentsIds.length) {
            var independentComponentsIds = this._getIndependentComponentsIds();
            if (independentComponentsIds) {
                this._next(independentComponentsIds);
            }
        }
    };

    Mainpage.prototype._next = function(ids) {
        var self = this;
        this._computeDependents();
        var independentComponentsIds = this._getIndependentComponentsIds();
        for (var i = 0; i < independentComponentsIds.length; i++) {
            // assuming every constructor to be asynchronous
            (function(id) {
                self._pendingComponentsIds.push(id);
                setTimeout(function() {
                    var done = function(instance) {
                        self._done(id, instance)
                    };
                    var component = self._components[id];
                    var r = self._components[id].constructor(self, done);
                    if (r) {
                        self._done(id, r);
                    }
                }, 0);
            })(independentComponentsIds[i]);
        }
    };

    /**
     * define a component
     * @param  {String} id
     * @param  {Array} dependencies
     * @param  {Function} constructor
     */
    Mainpage.prototype.define = function(id, dependencies, constructor) {
        if (!this._components[id]) {
            this._components[id] = {
                id: id,
                dependencies: dependencies,
                dependents: [],
                constructor: constructor,
                instane: null
            };
        } else {
            throw 'id exists';
        }
    };

    /**
     * get component instance by id
     * @param  {String} id
     * @return {Mixed} component instance
     */
    Mainpage.prototype.get = function(id) {
        return this._components[id];
    }

    /**
     * create components
     * @param  {components} [components] ids of components to create
     *                                   create all unless specified
     * @return {Promise}
     */
    Mainpage.prototype.create = function(components) {
        this._next(this._getIndependentComponentsIds());
    };

    Mainpage.deferred = function() {
        return new Promise();
    };

    if (module && module.exports) {
        module.exports = Mainpage;
    }

})();
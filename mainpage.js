var Mainpage = function() {
	this._components = {};
};

/**
 * define a component
 * @param  {String} id         
 * @param  {Array} dependencies 
 * @param  {Function} constructor
 */
Mainpage.prototype.define = function(id, dependencies, constructor) {

};

/**
 * get component instance by id
 * @param  {String} id
 * @return {Mixed} component instance
 */
Mainpage.prototype.get = function(id) {

}

/**
 * create components
 * @param  {components} [components] ids of components to create
 *                                   create all unless specified
 * @return {Promise} 
 */
Mainpage.prototype.create = function(components) {

};
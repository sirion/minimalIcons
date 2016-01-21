/**
 * Creates a DOM element of the given type (tag name) from the given attribute object. If an
 * attribute property is a string it is set on the element, if it is an object, a new sub element
 * is creates with the property-name as type. If an attribute property is an array of objects,
 * several sub elements of the same type are created.
 * This leads to the disadvantage that no element with several sub-elements of the same type that
 * do not follow each other can be created by this function.
 *
 *
 * @param {string} type Element type
 * @param {map} attributes
 * @param {string} namespace The namespace in which the element is created
 * @returns {HTMLElement}
 */
function createElement(type, attributes, namespace) {
	var el;

	if (namespace === undefined) {
		if (type.toLowerCase() === "svg") {
			namespace = "http://www.w3.org/2000/svg";
		} else {
			namespace = null;
		}
	}

	if (namespace) {
		el = document.createElementNS(namespace, type);
	} else {
		el = document.createElement(type);
	}

	for (var name in attributes) {
		if (Array.isArray(attributes[name])) {
			// Mutiple sub elements of same type
			attributes[name].forEach(function(attr, i) {
				el.appendChild(createElement(name, attr, namespace));
			});
		} else if (attributes[name] === undefined || attributes[name] === null) {
			// Text node
			el.appendChild(document.createTextNode(name));
		} else if (attributes[name] instanceof Element) {
			// Just add the already created element
			el.appendChild(attributes[name]);
		} else if (typeof attributes[name] === "function") {
			// Event callback
			el.addEventListener(name, attributes[name]);
		} else if (typeof attributes[name] === "object") {
			// Sub element
			el.appendChild(createElement(name, attributes[name], namespace));
		} else {
			// Attribute
			if (name.indexOf("xlink:") === 0) {
				el.setAttributeNS("http://www.w3.org/1999/xlink", name, attributes[name]);
			} else {
				el.setAttribute(name, attributes[name]);
			}
		}
	}
	return el;
}

/**
 * Merges (flat) the given objects/maps into a new one that is returned. Properties of every argument overwrite
 * the ones from the arguments before
 *
 * @param {...map} The objects to be merged
 * @returns {map} The merged object
 */
function mergeObjects() {
	var mergedObject = {};

	for (var i = 0; i < arguments.length; ++i) {
		for (var key in arguments[i]) {
			mergedObject[key] = arguments[i][key];
		}
	}

	return mergedObject;
}

var IconLibrary = {

	icons: {
		download: {
			line: [{
				x1: "20", y1: "80", x2: "80", y2: "80"
			}, {
				x1: "50", y1: "20", x2: "50", y2: "70"
			}, {
				x1: "30", y1: "50", x2: "50", y2: "70"
			}, {
				x1: "70", y1: "50", x2: "50", y2: "70"
			}]
		},
		next: {
			line: [{
				x1: "35", y1: "20", x2: "65", y2: "50"
			}, {
				x1: "35", y1: "80", x2: "65", y2: "50"
			}]
		},
		prev: {
			line: [{
				x1: "65", y1: "20", x2: "35", y2: "50"
			}, {
				x1: "65", y1: "80", x2: "35", y2: "50"
			}]
		},
		info: {
			line: [{
				x1: "50", y1: "45", x2: "50", y2: "70"
			}, {
				x1: "50", y1: "30", x2: "50", y2: "30"
			}]
		},
		close: {
			line: [{
				x1: "30", y1: "30", x2: "70", y2: "70"
			}, {
				x1: "30", y1: "70", x2: "70", y2: "30"
			}]
		},
		menu: {
			line: [{
				x1: "20", y1: "30", x2: "80", y2: "30"
			}, {
				x1: "20", y1: "50", x2: "80", y2: "50"
			}, {
				x1: "20", y1: "70", x2: "80", y2: "70"
			}]
		},
		menu2: {
			line: [{
				x1: "20", y1: "30", x2: "20", y2: "30"
			}, {
				x1: "35", y1: "30", x2: "80", y2: "30"
			}, {
				x1: "20", y1: "50", x2: "20", y2: "50"
			}, {
				x1: "35", y1: "50", x2: "80", y2: "50"
			}, {
				x1: "20", y1: "70", x2: "20", y2: "70"
			}, {
				x1: "35", y1: "70", x2: "80", y2: "70"
			}]
		}
	},

	invalidIcon: {
		"fill": "#f00",
		"stroke-width": "0",
		text: {
			x: 50,
			y: 50,
			width: 100,
			height: 100,
			"font-size": 80,
			"text-anchor": "middle",
			"alignment-baseline": "central",
			"?": null
		}
	},

	defaults: {
		version: "1.1",
		viewBox: "0 0 100 100",
		preserveAspectRatio: "none",
		"stroke-width": "5px",
		"stroke-linecap": "round",
	},

	createIcon: function(iconName, properties) {
		if (IconLibrary.icons[iconName]) {
			return createElement("svg", mergeObjects(IconLibrary.defaults, IconLibrary.icons[iconName], properties));
		} else {
			return createElement("svg", mergeObjects(IconLibrary.defaults, IconLibrary.invalidIcon, properties))
		}
	}

};

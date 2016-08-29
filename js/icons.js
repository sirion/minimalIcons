/**
 * Creates a DOM element of the given type (tag name) from the given attribute object. If an
 * attribute property is a string it is set on the element, if it is an object, a new sub element
 * is creates with the property-name as type. If an attribute property is an array of objects,
 * several sub elements of the same type are created, except when an array element is an HTMLElement,
 * in that case it will simply be appended.
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
		if (name === "style" && typeof attributes[name] === "object") {
			for (var styleName in attributes[name]) {
				el.style[styleName] = attributes[name][styleName];
			}
		} else if (Array.isArray(attributes[name])) {
			// Mutiple sub elements of same type
			attributes[name].forEach(function(attr, i) {
				if (attr instanceof HTMLElement) {
					el.appendChild(attr);
				} else {
					el.appendChild(createElement(name, attr, namespace));
				}
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
 * @param {boolean} [deep] - Whether to deep merge JS objects
 * @param {...map} The objects to be merged
 * @returns {map} The merged object
 */
function mergeObjects() {
	var i = 0
	var deep = false;
	if (arguments[0] === true || arguments[0] === false) {
		i = 1;
		deep = arguments[0];
	}
	var mergedObject = {};

	for (; i < arguments.length; ++i) {
		if (!arguments[i]) {
			continue;
		}
		for (var key in arguments[i]) {
			if (deep && mergedObject[key] && mergedObject[key].constructor === Object && arguments[i][key].constructor === Object) {
				mergedObject[key] = mergeObjects(true, mergedObject[key], arguments[i][key]);
			} else {
				mergedObject[key] = arguments[i][key];
			}
		}
	}

	return mergedObject;
}

var IconLibrary = {
	animations: {
		"animation-upload": "\
			@keyframes upload {\
				from {\
					transform: translateY(80%);\
				}\
				\
				to {\
					transform: translateY(0);\
				}\
			}\
		",
		"animation-restart": "\
			@keyframes rotate {\
				from {\
					transform: rotate(0);\
				}\
				\
				to {\
					transform: rotate(360deg);\
				}\
			}\
		"
	},


	icons: {
		"animation-upload": {
			g: [{
				line: {
					x1: "20", y1: "20", x2: "80", y2: "20"
				}
			}, {
				line: [{
					x1: "50", y1: "30", x2: "50", y2: "80"
				}, {
					x1: "30", y1: "50", x2: "50", y2: "30"
				}, {
					x1: "70", y1: "50", x2: "50", y2: "30"
				}],
				style: {
					"animation": "upload 800ms 0s ease infinite",
				}
			}]
		},
		"animation-restart": {
			path: [{
				fill: "none",
				d: "M 40 20 C 10 30 10 70, 40 80"
			}, {
				fill: "none",
				d: "M 60 20 C 90 30 90 70, 60 80"
			}],
			line: [{
				x1: 40, y1: 20, x2: 30, y2: 15
			}, {
				x1: 40, y1: 20, x2: 36, y2: 32
			}, {
				x1: 60, y1: 80, x2: 64, y2: 68
			}, {
				x1: 60, y1: 80, x2: 70, y2: 85
			}],
			style: {
				"animation": "rotate 4s 0s linear infinite",
			}
		},

		heart: {
			path: {
				d:	"M 50 75 " +
					"C 0 33, 41 18, 50 35" +
					"C 59 18, 100 33, 50 75",
			}
		},
		noEntry: {
			circle: {
				cx: 50,
				cy: 53,
				r: 25
			},
			line: {
				"stroke-linecap": "butt",
				"stroke-width": 10,
				x1: 32,
				y1: 53,
				x2: 68,
				y2: 53
			}
		},
		smileyHappy: {
			circle: [{
				"fill": "none",
				cx: 50,
				cy: 50,
				r: 30
			}, {
				"fill": "#000",
				cx: 40,
				cy: 38,
				r: 2
			}, {
				"fill": "#000",
				cx: 60,
				cy: 38,
				r: 2
			}],
			line: {
				x1: 50, y1: 42, x2: 50, y2: 52
			},
			path: {
				"fill": "none",
				d: "M 33 60 Q 50 75, 67 60"
			}
		},
		smileySad: {
			circle: [{
				"fill": "none",
				cx: 50,
				cy: 50,
				r: 30
			}, {
				"fill": "#000",
				cx: 40,
				cy: 38,
				r: 2
			}, {
				"fill": "#000",
				cx: 60,
				cy: 38,
				r: 2
			}],
			line: {
				x1: 50, y1: 42, x2: 50, y2: 52
			},
			path: {
				"fill": "none",
				d: "M 33 65 Q 50 55, 67 65"
			}
		},
		stop: {
			path: {
				d: "M 30 30 L 70 30 L 70 70 L 30 70 L 30 30"
			}
		},
		play: {
			fill: "none",
			path: {
				d: "M 30 30 L 70 50 L 30 70 L 30 30"
			}
		},
		pause: {
			"stroke-linecap": "butt",
			"stroke-width": 10,
			line: [{
				x1: 38, y1: 30, x2: 38, y2: 70
			},{
				x1: 62, y1: 30, x2: 62, y2: 70
			}]
		},
		restart: {
			path: [{
				fill: "none",
				d: "M 40 20 C 10 30 10 70, 40 80"
			}, {
				fill: "none",
				d: "M 60 20 C 90 30 90 70, 60 80"
			}],
			line: [{
				x1: 40, y1: 20, x2: 30, y2: 15
			}, {
				x1: 40, y1: 20, x2: 36, y2: 32
			}, {
				x1: 60, y1: 80, x2: 64, y2: 68
			}, {
				x1: 60, y1: 80, x2: 70, y2: 85
			}]
		},

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
		},
		fullscreen: {
			line: [{
				x1: "18", y1: "10", x2: "30", y2: "10"
			}, {
				x1: "10", y1: "18", x2: "10", y2: "30"
			}, {
				x1: "20", y1: "20", x2: "35", y2: "35"
			}, {
				x1: "70", y1: "10", x2: "82", y2: "10"
			}, {
				x1: "90", y1: "18", x2: "90", y2: "30"
			}, {
				x1: "80", y1: "20", x2: "65", y2: "35"
			}, {
				x1: "70", y1: "90", x2: "82", y2: "90"
			}, {
				x1: "90", y1: "82", x2: "90", y2: "70"
			}, {
				x1: "80", y1: "80", x2: "65", y2: "65"

			}, {
				x1: "18", y1: "90", x2: "30", y2: "90"
			}, {
				x1: "10", y1: "82", x2: "10", y2: "70"
			}, {
				x1: "20", y1: "80", x2: "35", y2: "65"
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
		"stroke": "black"
	},

	createIcon: function(iconName, properties) {
		if (IconLibrary.icons[iconName]) {
			if (IconLibrary.animations[iconName]) {
				var id = "IconLibrary-animation-" + iconName;
				var style = document.getElementById(id);
				if (!style) {
					style = document.createElement("style");
					style.appendChild(document.createTextNode(IconLibrary.animations[iconName]));
					style.id = id;
					document.head.appendChild(style);
				}
			}
			return createElement("svg", mergeObjects(true, IconLibrary.defaults, IconLibrary.icons[iconName], properties));
		} else {
			return createElement("svg", mergeObjects(true, IconLibrary.defaults, IconLibrary.invalidIcon, properties))
		}
	}

};

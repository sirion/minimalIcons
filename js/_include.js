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


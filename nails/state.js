'use strict';

class State {
 
    getInstance() {
        if (this.instance === null) {
            this.instance = new State();
        }
        return this.instance;
    }
    constructor() {
        this.data = {};
        this.activeElements = [];
        this.engine = new RenderingEngine(this);
        this.disabledElements = []

    }

    updateElementRefByObject(object, ref) {
        for (var element of this.activeElements) {
            if (element[1] === object) {
                element[0] = ref;
            }
        }
    }

    addActiveElement(ref, object, content, interpolation) {
        this.activeElements.push([ref, object, content, interpolation]);
    }

    findElementByRef(ref) {
        for (var element of this.activeElements) {
            if (element[0] === ref) return element;
        }
    }
    getHtmlReferenceOfStateElement(element) {
        return element[0];
    }
    stripAndTrimInterpolation(interpolation) {
        if(typeof interpolation !== 'string') return interpolation;
        interpolation = interpolation.replace('{{', '');
        interpolation = interpolation.replace('}}', '');
        interpolation = interpolation.trim();
        return interpolation;
    }


    disableElementIfNeeded(element) {
        if ('getAttribute' in element) {
            var statement = element.getAttribute('n-for');
            if (statement === null) return;
            var statementSplit = statement.split(' ');
            var name = statementSplit[1]; // var name of array
            this.engine.disableInterpolationForVariableNameOnElement(name, element);
        }

    }
    findElementsByObject(obj, prop) {
        var elements = [];
        for (var element of this.activeElements) {
            if (this.stripAndTrimInterpolation(element[3]) === prop) {
                elements.push(element);
            }
        }
        return elements;
    }
}
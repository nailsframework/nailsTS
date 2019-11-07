'use strict';
import { RenderingEngine } from "./engine";
import { State } from "./state";
export class NailsDirectives {

    directives: any
    constructor() {
        this.directives = ['if', 'form', 'for', 'test']
    }
    /*
        A directive exists of an element (string) in the @directives array and a function declaration 
        below.
        directive and function need to have the same name 
        sample body:
        sample(element, statement, state){

        }
        where element is the element where the directive is added and statemenet
        what has been declaired.
        sample arguments
        element = h1 reference
        statement = var object of objects
        state = current state

        For reactivness, only use elements in the data object within the state, as these
        are actively monitored. 

        DONT PREFIX YOUR DIRECTIVE AND FUNCTIONS WITH AN N
    */

    form(element: HTMLElement, statement: string, state: State) {
        if (element.getAttribute('type') === 'text') {
            if (state.data[statement] !== element.innerText) {
                state.data[statement] = element.innerText;
            }
        }
        element.addEventListener("input", function () {
            if (state.data[statement] !== element.innerText) {
                state.data[statement] = element.innerText;

            }
        });

    }



    for(element: HTMLElement, statemenet: string, state: State) {
        console.error('called')
        const engine = new RenderingEngine(state);
        engine.disableInterpolationForVariableNameOnElement(statemenet.split(' ')[1], element);

        element.style.display = "none";
        function interpolateCustomElement(element: HTMLElement, object: any, descriptor: any) {
            //Performancewise, we render the whole html element.
            var html = element.innerHTML;
            var interpolations = engine.getInterpolationsForTextContent(html);
            for (var interpolation of interpolations) {
                var stripped = engine.stripAndTrimInterpolation(interpolation);
                var args = stripped.split('.');
                args[0] = '';
                stripped = '';
                for (var arg of args) {
                    stripped += arg + '.'
                }
                stripped = stripped.substring(0, stripped.length - 1);

                if (engine.getValueOfInterpolation(interpolation) !== 'undefined') {
                    html = html.replace(interpolation, engine.getValueOfInterpolation(interpolation))
                } else {
                    html = html.replace(interpolation, engine.sanitize(eval('object' + stripped)));
                }


            }
            element.innerHTML = html;

        }
        var descriptor = statemenet.split(' ')[1];
        var arr = statemenet.split(' ')[3];
        var refArray = eval("state.data." + arr);
        if (typeof refArray === 'undefined' || refArray === null) return;

        var parent = element.parentNode;
        for (var i of refArray) {
            var child = document.createElement(element.nodeName);
            child.innerHTML = element.innerHTML;
            interpolateCustomElement(child, i, descriptor);
            parent.appendChild(child);
            engine.disableInterpolationForVariableNameOnElement(statemenet.split(' ')[1], child);

            for (let i of element.attributes) {
                if (i.name !== 'n-for' && i.name !== 'style') {
                    child.setAttribute(i.name, i.value)
                }
            }
            engine.executeDirectivesOnElement(child, true)
        }

    }
    if(element: HTMLElement, statement: string, state: State) {
        if (statement === 'true' || 'false') {
            if (statement === 'true') {
                element.style.visibility = 'visible';
                return;
            } else {
                element.style.visibility = 'hidden';
                return;
            }
        }

        var reversed = false;
        if (statement[0] === '!') {
            statement = statement.substring(1);
            reversed = true;
        }
        if (state.data.hasOwnProperty(statement)) {
            if (reversed) {
                if (!eval(state.data[statement])) {
                    element.style.visibility = 'visible';
                } else {

                    element.style.visibility = 'hidden';
                }
            } else {
                if (eval(state.data[statement])) {
                    element.style.visibility = 'visible';
                } else {
                    element.style.visibility = 'hidden';

                }
            }

        } else {
            console.warn('statement: ' + statement + ' not found in context')
        }
    }

}
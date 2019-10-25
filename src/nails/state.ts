'use strict';
import { RenderingEngine } from './engine';
import { ComponentEngine } from './componentEngine';
import { Injector } from './core/injector';
import { IActiveElement } from './interfaces/ActiveElement';
import { ActiveElement } from './classes/ActiveElement';
import { Router } from './coreComponents/router.component';

export class State {
    instance: State
    data: any
    activeElements: IActiveElement[]
    activeDirectiveElements: IActiveElement[]
    engine: RenderingEngine
    disabledElements: ActiveElement[]
    componentEngine: ComponentEngine
    injector: Injector
    element: string
    methods: any
    components: any
    mountedComponents: any
    router: Router
    injectors: any[]


    getInstance() {
        if (this.instance === null) {
            this.instance = new State();
        }
        return this.instance;
    }
    constructor() {
        this.data = {};
        this.activeElements = [];
        this.activeDirectiveElements = [];
        this.engine = new RenderingEngine(this);
        this.disabledElements = []
        this.componentEngine = new ComponentEngine(this, this.engine, null, []);

    }
    addInjector(injector: Injector) {
        this.injector = injector;
    }
    addActiveDirectiveElement(key: string, statement: string, element: HTMLElement) {

        for (var el of this.activeDirectiveElements) {
            if (el.key === key && el.statement === statement && el.element === element) {
                console.warn('refusing to insert element');
                return;
            }
        }

        let activeElement = new ActiveElement(element, '', '', '', key, statement);


        this.activeDirectiveElements.push(activeElement);

    }

    updateElementRefByObject(object: Object, ref: HTMLElement) {
        for (var element of this.activeElements) {
            if (element.element === ref) {
                element.reference = object;
            }
        }
    }

    addActiveElement(ref: HTMLElement, object: any, content: string, interpolation: string) {
        let activeElement = new ActiveElement(ref, object, content, interpolation, '', '');
        this.activeElements.push(activeElement);
    }

    findElementByRef(ref: HTMLElement) {
        for (var element of this.activeElements) {
            if (element.reference === ref) return element;
        }
    }
    getHtmlReferenceOfStateElement(element: ActiveElement) {
        return element.reference;
    }
    stripAndTrimInterpolation(interpolation: string) {
        if (typeof interpolation !== 'string') return interpolation;
        interpolation = interpolation.replace('{{', '');
        interpolation = interpolation.replace('}}', '');
        interpolation = interpolation.trim();
        return interpolation;
    }


    disableElementIfNeeded(element: HTMLElement) {
        if ('getAttribute' in element) {
            var statement = element.getAttribute('n-for');
            if (statement === null) return;
            var statementSplit = statement.split(' ');
            var name = statementSplit[1]; // var name of array
            this.engine.disableInterpolationForVariableNameOnElement(name, element);
        }

    }
    findElementsByObject(obj: any, prop: string) {
        var elements = [];
        for (var element of this.activeElements) {
            if (this.stripAndTrimInterpolation(element.interpolation) === prop) {
                elements.push(element);
            }
        }

        for (let element of this.activeDirectiveElements) {

            prop = prop.replace('!', '');
            element.statement = element.statement.replace('!', '');
            if (this.stripAndTrimInterpolation(element.statement) === prop) {
                let activeElement = new ActiveElement(element.element, obj, element.element.innerText, '', '', '');
                elements.push(activeElement);
            }
        }



        return elements;
    }
}
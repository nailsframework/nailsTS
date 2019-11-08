"use strict";
import { ActiveElement } from "../classes/ActiveElement";
import { ComponentEngine } from "../componentEngine";
import { Injector } from "../core/injector";
import { Router } from "../core/components/router.component";
import { RenderingEngine } from "./engine";
import { IActiveElement } from "../interfaces/ActiveElement";

export class State {
    public instance: State;
    public data: any;
    public activeElements: IActiveElement[];
    public activeDirectiveElements: IActiveElement[];
    public engine: RenderingEngine;
    public disabledElements: ActiveElement[];
    public componentEngine: ComponentEngine;
    public injector: Injector;
    public element: string;
    public methods: any;
    public components: any;
    public mountedComponents: any;
    public router: Router;
    public click: any = {};
    public injectors: any[];
    constructor() {
        this.data = {};
        this.activeElements = [];
        this.activeDirectiveElements = [];
        this.engine = new RenderingEngine(this);
        this.disabledElements = [];
        this.componentEngine = new ComponentEngine(this, this.engine, null, []);

    }


    public getInstance() {
        if (this.instance === null) {
            this.instance = new State();
        }
        return this.instance;
    }
    public addInjector(injector: Injector) {
        this.injector = injector;
    }
    public addActiveDirectiveElement(key: string, statement: string, element: HTMLElement) {

        for (let el of this.activeDirectiveElements) {
            if (el.key === key && el.statement === statement && el.element === element) {
                console.warn("refusing to insert element");
                return;
            }
        }

        const activeElement = new ActiveElement(element, "", "", "", key, statement);


        this.activeDirectiveElements.push(activeElement);

    }

    public updateElementRefByObject(object: Object, ref: HTMLElement) {
        for (let element of this.activeElements) {
            if (element.element === ref) {
                element.reference = object;
            }
        }
    }

    public addActiveElement(ref: HTMLElement, object: any, content: string, interpolation: string) {
        const activeElement = new ActiveElement(ref, object, content, interpolation, "", "");
        this.activeElements.push(activeElement);
    }

    public findElementByRef(ref: HTMLElement) {
        for (let element of this.activeElements) {
            if (element.reference === ref) { return element; }
        }
    }
    public getHtmlReferenceOfStateElement(element: ActiveElement) {
        return element.reference;
    }
    public stripAndTrimInterpolation(interpolation: string) {
        if (typeof interpolation !== "string") { return interpolation; }
        interpolation = interpolation.replace("{{", "");
        interpolation = interpolation.replace("}}", "");
        interpolation = interpolation.trim();
        return interpolation;
    }


    public disableElementIfNeeded(element: HTMLElement) {
        if ("getAttribute" in element) {
            let statement = element.getAttribute("n-for");
            if (statement === null) { return; }
            let statementSplit = statement.split(" ");
            let name = statementSplit[1]; // var name of array
            this.engine.disableInterpolationForVariableNameOnElement(name, element);
        }

    }
    public findElementsByObject(obj: any, prop: string) {
        let elements = [];
        for (let element of this.activeElements) {
            if (this.stripAndTrimInterpolation(element.interpolation) === prop) {
                elements.push(element);
            }
        }

        for (const element of this.activeDirectiveElements) {

            prop = prop.replace("!", "");
            element.statement = element.statement.replace("!", "");
            if (this.stripAndTrimInterpolation(element.statement) === prop) {
                const activeElement = new ActiveElement(element.element, obj, element.element.innerText, "", "", "");
                elements.push(activeElement);
            }
        }



        return elements;
    }
}

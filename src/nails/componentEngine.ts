import { Router } from './core/components/router.component';
import { RenderingEngine } from './core/engine';
import { Nails } from './nails';
import { State } from './core/state';


export class ComponentEngine {
    public state: State;
    public engine: RenderingEngine;
    public nails: Nails;
    public routings: any;
    public instance: ComponentEngine;
    public renderedElements: HTMLElement[] = [];

    constructor(state: State, engine: RenderingEngine, nails: Nails, routings: any) {
        this.state = state;
        this.engine = engine;
        this.instance = this;
        this.nails = nails;
        this.routings = routings;
    }

    public getInstance() {
        return this.instance;
    }

    public injectComponents() {
        if (Array.isArray(this.state.mountedComponents)) { return; }
        this.state.mountedComponents = [];

        for (const component of this.state.components) {
            const instance = new component(this.state);
            if (instance instanceof Router) {
                this.state.router = instance;
                instance.addRoutings(this.routings);
                instance.navigate("");
            }

            this.state.mountedComponents.push(instance);
        }
    }

    public traverseElementAndExecuteDirectives(element: HTMLElement) {

        if (!element) { return; }
        if (element.childNodes.length > 0) {
            for (const child of element.childNodes) {
                this.traverseElementAndExecuteDirectives(child as HTMLElement);
            }
        }

        this.engine.executeDirectivesOnElement(element, true);

    }

    private shallRenderElement(element: HTMLElement): boolean {
        // Don't forget to clear this array as it may messes with the DOM.
        for (const parent of this.renderedElements) {
            if (this.engine.isDescendant(parent, element)) {
                return false;
            }
        }
        return true;
    }
    // tslint:disable-next-line:member-ordering
    public renderComponents(exclude?: HTMLElement) {
        this.injectComponents();
        // tslint:disable-next-line:max-line-length
        if (typeof this.state.mountedComponents !== "undefined" && this.state.mountedComponents !== null && this.state.mountedComponents.length > 0) {
            for (let i = 0; i < 300; i++) {
                const html = document.body.innerHTML;

                let newHtml;
                for (let component of this.state.mountedComponents) {
                    let elements = document.getElementsByTagName(component.selector);
                    if (elements.length === 0) {
                        continue;
                    }
                    for (const element of elements) {

                        if (element.childNodes.length > 0) {
                            continue;
                        }
                        const componentHTML = component.render();
                        if (componentHTML.includes("<" + component.selector + ">")) {
                            continue;
                        }
                        element.innerHTML = componentHTML;

                        // this.engine.executeInerpolationsOnElement(element);
                        // this.traverseElementAndExecuteDirectives(element);



                    }
                    newHtml = document.body.innerHTML;

                }
                if (html === newHtml) {
                    break;

                }
            }
            for (let component of this.state.mountedComponents) {
                let elements = document.getElementsByTagName(component.selector);
                if (elements.length === 0) {
                    continue;
                }
                for (const element of elements) {
                    if (element.childNodes.length > 0) {
                        if (element === exclude) {
                            continue;
                        }

                        if (this.shallRenderElement(element)) {
                            this.traverseElementAndExecuteDirectives(element);
                            this.engine.executeInerpolationsOnElement(element);
                            this.renderedElements.push(element);
                        }

                    }

                }
            }
            this.renderedElements = [];
        }
    }


    public recreateComponentsByName(name: string) {
        if (typeof this.state.mountedComponents !== "undefined" && this.state.mountedComponents !== null) {
            let component = null;
            for (let c of this.state.mountedComponents) {
                if (c.selector === name) {
                    component = c;
                }
            }
            if (component === null) {
                return;
            }
            if (this.state.mountedComponents[name] === null) {
                return;
            }
            let elements = document.getElementsByTagName(name);
            for (let element of elements) {
                const componentHTML = component.render();
                if (componentHTML.includes("<" + component.selector + ">")) {
                    console.error("component " + component.selector + " has a recursion with no exit condition");
                    continue;
                }
                element.innerHTML = componentHTML;
                this.renderComponents(element as HTMLElement);
            }
        } else {
        }
    }


    public recreateAllComponents() {
        this.renderComponents();
    }
}

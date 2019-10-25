'use strict';
import { State } from './state';
import { RenderingEngine } from './engine'
import { ComponentEngine } from './componentEngine'
import { Injector } from './core/injector';


class Factory {
    create<T>(type: (new () => T)): T {
        return new type();
    }
}
export class Nails {

    state: State;
    engine: RenderingEngine
    componentEngine: ComponentEngine
    injector: Injector

    constructor(object: any) {

        if (typeof object.methods.onInit !== 'undefined') {
            object.methods.onInit();
        }
        this.state = new State();
        if (object.hasOwnProperty('el')) {
            this.state.element = object.el;
        } else {
            console.error("NailsJS cannot be initalized, because no element was specified");
        }
        if (object.hasOwnProperty('data')) {
            this.state.data = object.data;
        }
        if (object.hasOwnProperty('methods')) {
            this.state.methods = object.methods;
        }
        if (typeof object.components === 'undefined') {
            this.state.components = [];
        } else {
            if (Array.isArray(object.components)) {
                this.state.components = object.components;
            } else {
                this.state.components = [];

            }
        }
        this.engine = new RenderingEngine(this.state);
        this.componentEngine = new ComponentEngine(this.state, this.engine, this, object.routings);
        this.setUpProxy();
        this.injector = new Injector(this.state);
        this.prepareInjector(object.declarations);
        this.state.addInjector(this.injector);
        this.componentEngine.renderComponents();
        this.engine.indexDOM();
        this.engine.setTitle();
        this.state.methods.getState = function () {
            return this.state;
        }
        if (typeof this.state.methods.onMounted !== 'undefined') {
            this.state.methods.onMounted(this.state);

        }
    }



    prepareInjector(arr: []) {
        let factory = new Factory();
        if (!Array.isArray(arr)) {
            console.warn('Cannot iterate over declarations, since they are not an array');
            return;
        }
        for (let d of arr) {
            let instance = factory.create(d);
            this.injector.insert(instance);
        }
    }
    notifyDOM(target: any, prop: any, value: string) {

        var refs = this.state.findElementsByObject(target, prop);
        if (refs === [] || refs.length === 0) {
            return;
        };
        for (var ref of refs) {
            this.engine.updateInterpolatedElement(ref.element, ref.content);
            this.engine.executeDirectivesOnElement(ref.element, false);
        }

        return true;
    };

    setUpProxy() {
        var handler = {
            state: this.state,
            notifyDom: this.notifyDOM,
            engine: this.engine,

            get: function (target: any, prop: any, receiver: any) {
                return target[prop];

            },
            set(target: any, prop: any, value: string) {
                target[prop] = value;
                this.notifyDom(target, prop, '');
                return true;
            }
        };

        var proxy = new Proxy(this.state.data, handler);
        this.state.data = proxy;
    };



}
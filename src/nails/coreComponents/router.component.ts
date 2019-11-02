import { State } from "../state";
import { ComponentEngine } from "../componentEngine";

export class Router {
    state: State
    selector: string
    hashRoute: string
    engine: ComponentEngine
    routings: any
    constructor(state: State) {
        this.state = state;
        var that = this;
        this.selector = 'yield';
        this.hashRoute = window.location.hash.replace('#/', '');

        this.engine = state.componentEngine;
        window.onhashchange = function () {
            if (typeof that.engine === 'undefined') {
                return;
            }

            that.hashRoute = window.location.hash.replace('#/', '');

            that.engine.recreateComponentsByName('yield'); // TODO: Find better way
        }


    }


    isFunction(functionToCheck: any) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
    addRoutings(routings: any) {
        this.routings = routings;
    }

    getHashRoute(){
       return window.location.hash.replace('#/', '');
    }

    getComponent() {
        if (typeof this.routings === 'undefined') return 'div';
        for (var route of this.routings) {
            if (route.route === this.getHashRoute()) {

                if (this.isFunction(route.guard)) {
                    if (route.guard(this)) {
                        var instance = new route.component(this.state);
                        return instance.selector;
                    } else {
                        return 'div'
                    }
                } else {
                    var instance = new route.component(this.state);
                    return instance.selector;
                }

            }
        }
    }
    navigate(where: string) {
        window.location.hash = "/" + where.replace('/', '');
    }

    render() {
        return `
            <${this.getComponent()}></${this.getComponent()}>
        `
    }
}
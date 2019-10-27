import { State } from "../state";
import { ComponentEngine } from "../componentEngine";
export declare class Router {
    state: State;
    selector: string;
    hashRoute: string;
    engine: ComponentEngine;
    routings: any;
    constructor(state: State);
    isFunction(functionToCheck: any): boolean;
    addRoutings(routings: any): void;
    getComponent(): any;
    navigate(where: string): void;
    render(): string;
}

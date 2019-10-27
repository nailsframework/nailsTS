import { State } from './state';
import { RenderingEngine } from './engine';
import { Nails } from './nails';
export declare class ComponentEngine {
    state: State;
    engine: RenderingEngine;
    nails: Nails;
    routings: any;
    instance: ComponentEngine;
    constructor(state: State, engine: RenderingEngine, nails: Nails, routings: any);
    getInstance(): ComponentEngine;
    injectComponents(): void;
    traverseElementAndExecuteDirectives(element: HTMLElement): void;
    renderComponents(): void;
    recreateComponentsByName(name: string): void;
    recreateAllComponents(): void;
}

import { State } from './state';
import { RenderingEngine } from './engine';
import { ComponentEngine } from './componentEngine';
import { Injector } from './core/injector';
export declare class Nails {
    state: State;
    engine: RenderingEngine;
    componentEngine: ComponentEngine;
    injector: Injector;
    constructor(object: any);
    prepareInjector(arr: []): void;
    notifyDOM(target: any, prop: any, value: string): boolean;
    setUpProxy(): void;
}

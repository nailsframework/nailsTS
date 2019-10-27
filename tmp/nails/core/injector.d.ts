import { State } from "../state";
export declare class Injector {
    state: State;
    constructor(state: State);
    bootstrap(): void;
    insert(clazz: any): void;
    resolve(clazz: any): any;
}

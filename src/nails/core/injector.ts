import { State } from "../core/state";

export class Injector {
    state: State

    constructor(state: State) {
        this.state = state;
        this.bootstrap();
    }
    bootstrap() {
        this.state.injectors = [];
    }

    insert(clazz: any) {
        for (let c of this.state.injectors) {
            if (c instanceof clazz) return;
        }
        this.state.injectors.push(clazz);
    }
    resolve(clazz: any) {
        for (var c of this.state.injectors) {
            if (c instanceof clazz) return c;
        }
    }
}
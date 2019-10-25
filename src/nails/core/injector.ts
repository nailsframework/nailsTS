import { State } from "../state";

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
        console.log(this.state.injectors)
        for (let c of this.state.injectors) {
            if (c instanceof clazz) return;
        }
        this.state.injectors.push(clazz);
    }
    resolve(clazz: any) {
        console.log(this.state.injectors)
        for (var c of this.state.injectors) {
            if (c instanceof clazz) return c;
        }
    }
}
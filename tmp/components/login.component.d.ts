import { Greeter } from "../modules/injectme.module";
import { State } from "../nails/state";
export declare class LoginComponent {
    state: State;
    selector: string;
    i: number;
    greeter: Greeter;
    constructor(state: State);
    incrementCounter(): number;
    render(): string;
}

import { Greeter } from "../modules/injectme.module";
import { State } from "../nails/state";
import { IComponent } from "../nails/interfaces/Component";

export class LoginComponent implements IComponent {
  state: State;
  selector: string;
  i: number;
  greeter: Greeter;
  constructor(state: State) {
    this.state = state;
    this.selector = 'login'
    this.i = 0;
    this.greeter = this.state.injector.resolve(Greeter)
  }
  incrementCounter() {
    this.i++;
    return this.i;
  }

  render() {
    /*html*/

    return `
        <div>
          <input type="text" placeholder="Username ">
          <input type="text" placeholder="Username">
          ${this.greeter.greet('Dominic')}
        </div>
      `
  }
}
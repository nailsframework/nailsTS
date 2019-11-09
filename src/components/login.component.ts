import { Greeter } from "../modules/injectme.module";
import { State } from "@nailsframework/nails/lib/core/state";
import { IComponent } from "@nailsframework/nails/lib/interfaces/Component";

export class LoginComponent implements IComponent {
  public state: State;
  public selector: string;
  public i: number;
  public greeter: Greeter;
  constructor(state: State) {
    this.state = state;
    this.selector = 'login';
    this.i = 0;
    this.greeter = this.state.injector.resolve(Greeter);
  }
  public incrementCounter() {
    this.i++;
    return this.i;
  }

  public render() {
    /*html*/

    return `
        <div>
          <input type="text" placeholder="Username ">
          <input type="text" placeholder="Username">
          ${this.greeter.greet("Dominic")}
        </div>
      `;
  }
}

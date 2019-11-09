import { Greeter } from "../modules/injectme.module";
import { State } from "../nails/core/state";
import { IComponent } from "../nails/interfaces/Component";
import { Fibonacci } from "../modules/fibonacci.module";

export class FibonacciComponent implements IComponent {
    public selector: string;
    constructor(public state: State) {
        this.state = state;
        this.selector = 'fibonacci'
        this.state.data.fibNumber = 10;
        this.updateFibonacciNumber();
    }
    public async findFibonacciOf(index: number): Promise<any> {
        const fib = new Fibonacci();
        fib.index = index;
        return fib.calculateFibonacciNumber();
    }
    public async updateFibonacciNumber() {
        this.state.data.fib = "Calculating..";
        this.findFibonacciOf(this.state.data.fibNumber).then((val: string) => {
            this.state.data.fib = val;
        });
    }

    public render() {
        /*html*/
        return `
        <div>
            <input type="text" placeholder="Number" n-form="fibNumber">
            <button n-click='updateFibonacciNumber()'>Calculate</button>
            <p>Calculated Number is: {{fib}}<p>
        </div>
      `;
    }
}
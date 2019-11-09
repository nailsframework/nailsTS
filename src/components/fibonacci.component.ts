import { Fibonacci } from "../modules/fibonacci.module";
import { State } from "../nails/core/state";
import { IComponent } from "../nails/interfaces/Component";

export class FibonacciComponent implements IComponent {
    public selector: string;
    constructor(public state: State) {
        this.state = state;
        this.selector = "fibonacci";
        this.state.data.fibNumber = 10;
        this.updateFibonacciNumber();
    }
    public async findFibonacciOf(index: number): Promise<any> {
        const fib = new Fibonacci();
        fib.index = index;
        return fib.calculateFibonacciNumber();
    }
    public async setStatus(status: string): Promise<void> {
        this.state.data.fib = status;
    }
    public async updateFibonacciNumber(): Promise<void> {
        await this.setStatus("Calculating");
        await this.findFibonacciOf(this.state.data.fibNumber).then((val: string) => {
            this.state.data.fib = val;
        });
        return null;
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

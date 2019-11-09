

import { State } from "./nails/core/state";
import { IComponent } from "./nails/interfaces/Component";

export class AppComponent implements IComponent {
    public selector: string;
    constructor(public state: State) {
        this.selector = "App";
    }

    public render() {
        /*html */
        return `
        <body>
            <div class="image-container bounceInUp animated">
            <img src='assets/logo.png' height="400" width="400">
            </div>
            <a href="https://github.com/nailsframework/nails" class="animated bounceInRight link">Visit us on GitHub</a>
        </body>
        <yield></yield>
        <footer>
            Make Web Developement faster and less painful. Get startet today with {{ whoami }}
        </footer>
        `;
    }

}






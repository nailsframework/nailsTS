import { State } from "@nailsframework/nails/lib/core/state";
import { CoreComponent } from "@nailsframework/nails/lib/core/components/core.component";


export class AppComponent extends CoreComponent {
    public selector: string;
    constructor(public state: State) {
        super(state);
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






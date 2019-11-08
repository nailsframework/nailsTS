import { LoginComponent } from "./components/login.component"
import { NavbarComponent } from "./components/navbar.component";
// tslint:disable-next-line: ordered-imports
import { ShowcaseComponent } from "./components/showcase.component";
import { Greeter } from "./modules/injectme.module";
import { Router } from "./nails/core/components/router.component";
import { Nails } from "./nails/nails"
import { State } from "./nails/core/state";




const nails = new Nails({
    el: "body", // Start with # to specify id
    // tslint:disable:object-literal-sort-keys
    data: {
        title: "Your Nails App",
        whoami: "NailsJS",
        sample: [
            { name: "Jill", lastname: "smith" },
            { name: "Ingo", lastname: "Meyers" },
        ],
    },
    methods: {
        onInit() {
            // tslint:disable-next-line:max-line-length
            // This method is called during early construction of the State. As a result, there no state supplied as an argument.
            // tslint:disable-next-line:max-line-length
            // You may use this, to trigger your own scripts. Beware, that the dom is not rendered at this time, so use OnMounted for any DOM operations.
        },
        onMounted(currentState: State) {
            currentState.data.headers = [{ "Test": "Value" }];
        },

    },
    components: [
        LoginComponent, Router, ShowcaseComponent, NavbarComponent,
    ],
    routings: [{
        component: LoginComponent,
        route: "login",
    }],
    declarations: [
        Greeter,
    ],
});




import { State } from "./core/state";

let get = function (url: string, state: State, callback: Function) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);

    if (typeof state.data.headers !== "undefined") {
        for (const header of state.data.headers) {
            xmlHttp.setRequestHeader(Object.keys(header)[0], header[Object.keys(header).pop()]);
        }
    }
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            callback(JSON.parse(xmlHttp.responseText), xmlHttp.status);
        }
    };
    xmlHttp.send(null);
};


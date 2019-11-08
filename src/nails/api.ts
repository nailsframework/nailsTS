import { State } from "./core/state";

var get = function (url: string, state: State, callback: Function) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);

    if (typeof state.data.headers !== 'undefined') {
        for (var header of state.data.headers) {
            xmlHttp.setRequestHeader(Object.keys(header)[0], header[Object.keys(header).pop()])
        }
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4)
            callback(JSON.parse(xmlHttp.responseText), xmlHttp.status);
    }
    xmlHttp.send(null);
}


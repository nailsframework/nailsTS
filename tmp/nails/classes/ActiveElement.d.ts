import { IActiveElement } from '../interfaces/ActiveElement';
export declare class ActiveElement implements IActiveElement {
    key: string;
    statement: string;
    element: HTMLElement;
    reference: any;
    content: string;
    interpolation: string;
    constructor(element: HTMLElement, reference: any, content: string, interpolation: string, key: string, statement: string);
}

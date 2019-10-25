import {IActiveElement} from '../interfaces/ActiveElement';
export class ActiveElement implements IActiveElement{
    key: string;
    statement: string;
    element: HTMLElement;    
    reference: any;
    content: string;
    interpolation: string;

    constructor(element: HTMLElement, reference: any, content: string, interpolation: string, key: string, statement:string){
        this.element = element;
        this.reference = reference;
        this.content = content;
        this.key =key;
        this.statement = statement;
        this.interpolation = interpolation;
    }

}
'use strict';
import { NailsDirectives } from './directiveDefinitions';
import { State } from './state';
import { ActiveElement } from './classes/ActiveElement';
export class RenderingEngine {

    state: State
    directives: NailsDirectives

    constructor(state: State) {
        if (typeof state === 'undefined' || state === null) {
            console.log("Engine was initialized without a state");
        }
        this.state = state;
        this.directives = new NailsDirectives();

    }

    indexDOM() {
        if (typeof this.state.element !== 'undefined') {
            var element = null;
            if (this.state.element.startsWith('#')) {
                var selector = this.state.element.substr(1);
                element = document.getElementById(selector);
            } else {
                element = document.getElementsByTagName(this.state.element);
            }

            if (typeof element === 'undefined' || element === null) {
                console.error('No element with selector: ' + this.state.element + ' has been found');
                return;
            }
            if (element instanceof HTMLCollection && element.length > 1) {
                console.error('Multiple choices, try using id if the element tag is not unique. Your Selector was: ' + this.state.element);
                return;
            }
            if (element instanceof HTMLCollection && element.length === 0) {
                console.error('No element with selector: ' + this.state.element + ' has been found');
                return;
            }
            if (element instanceof HTMLCollection) {
                element = element[0];
            }


            //From now on, we need to loop through all elements
            var activeElements = this.indexElement(<HTMLElement>element);
            //Execute Directives

            //TODO: Manage the activeElements here and not in interpolations
            for (var el of activeElements) {
                this.executeDirectivesOnElement(el, true);
            }
            this.executeInerpolationsOnElement(<HTMLElement>element);
        }
    }


    insert(index: number, string: string, ref: string) {
        if (index > 0)
            return ref.substring(0, index) + string + ref.substring(index, ref.length);

        return string + ref;
    };


    setTitle() {
        if (typeof this.state.data.title !== 'undefined' || this.state.data.title === null) {
            document.title = this.state.data.title;
        }
    }

    elementCanGetAttribute(element: HTMLElement) {
        return 'getAttribute' in element;
    }

    isNForActivated(element: HTMLElement) {
        if (this.elementCanGetAttribute(element)) {
            return element.getAttribute('n-for') !== null;
        }
        return false;
    }

    disableInterpolationForVariableNameOnElement(name: string, element: HTMLElement) {
        if (typeof name === 'undefined' || typeof element === 'undefined') return;
        for (var el of this.state.disabledElements) {
            if (el.content == name && el.element == element) {
                return;
            }
        }
        let activeElement = new ActiveElement(element, null, '', name, '', '');
        this.state.disabledElements.push(activeElement);
    }
    getElementDerrivedObject(element: HTMLElement) {
        return 'object'
    }
    getElementDerrivedProperty(element: HTMLElement) {
        return 'property'
    };
    getForArrayByStatement(statement: string) {
        let statements = statement.split(' ');
        return statements[statements.length];
    }
    isForAttribute(element: ActiveElement) {
        let el = element.element;
        if ('getAttribute' in el) {
            return el.getAttribute('n-for') !== null;
        } else {
            return false;
        }
    }

    isActiveElement(element: HTMLElement) {
        return this.getElementDirectives(element).length > 0;

    }

    removePrefix(directive: string) {
        return directive.substring(2)
    }
    prefixDiretive(directive: string) {
        return 'n-' + directive;
    }
    getElementDirectives(element: HTMLElement) {
        if (typeof element === 'undefined') {
            return [];
        }
        var directives : string[] = [];
        for (var directive of this.directives.directives) {
            directive = this.prefixDiretive(directive);
            if ('hasAttribute' in element && element.hasAttribute(directive)) {
                directives.push(directive);
            }
        }
        return directives;
    }

    indexElement(element: HTMLElement) {
        this.state.disableElementIfNeeded(element);
        let activeElements: any[] = [];
        for (var child of element.childNodes) {
            var active = this.indexElement(<HTMLElement>child);
            activeElements.push.apply(activeElements, active);
        }
        if (this.isActiveElement(element)) {
            activeElements.push(element);
        }

        return activeElements;
    }

    getElementAttributeForDirective(element: HTMLElement, directive: string) {
        directive = this.prefixDiretive(directive);
        if (element.hasAttribute(directive)) {
            return element.getAttribute(directive);
        } else {
            console.warn('directive: ' + directive + ' not found on element: ' + element);
            return '';
        }
    }
    executeDirectivesOnElement(element: HTMLElement, add: Boolean) {
        var directives = this.getElementDirectives(element);
        for (let directive of directives) {
            directive = this.removePrefix(directive);
            if (directive in this.directives) {
                eval('this.directives.' + directive +'(element, this.getElementAttributeForDirective(element, directive), this.state');
                let nDirectives = this.getElementDirectives(element);
                if (add) {
                    for (var dir of nDirectives) {
                        this.state.addActiveDirectiveElement(dir, element.getAttribute(dir), element)
                    }
                }
            } else {
                console.warn('not found directive: ' + directive)
            }
        }
    }




    stripAndTrimNForInterpolation(interpolation: string) {
        interpolation = interpolation.replace('[[[', '');
        interpolation = interpolation.replace(']]]', '');
        interpolation = interpolation.trim();
        return interpolation;
    }

    getNForInterpolations(content: string) {
        let interpolations: string[]
        content = content.trim();
        var matches = content.match(/\[\[\[(( +)?\w+.?\w+( +)?)\]\]\]/g);
        if (matches === null) return interpolations;
        for (let match of matches) {
            interpolations.push(match);
        }

        return interpolations;
    }
    getNForInterpolation(interpolation: string) {
        interpolation = interpolation.trim();
        if (interpolation.match(/\[\[\[(( +)?\w+.?\w+( +)?)\]\]\]/g)) {
            interpolation = this.stripAndTrimNForInterpolation(interpolation);
        } else {
            console.warn('Not found interpolation in submitted value: ' + interpolation);
            return interpolation;
        }

        return interpolation;

    }
    getValueOfInterpolation(interpolation: string) {
        // This comes in the format of {{ interpolation }}
        interpolation = interpolation.trim();
        if (interpolation.match(/{{(.?\s?\w?.?\w\s?)+}}/g)) {
            interpolation = this.stripAndTrimInterpolation(interpolation);

        } else {
            console.warn('Not found interpolation in submitted value: ' + interpolation);
            return interpolation;
        }
        interpolation = interpolation.trim();
        var stripped = this.stripAndTrimInterpolation(interpolation);

        var args = stripped.split('.');
        stripped = '';
        for (var arg of args) {
            stripped += arg + '.'
        }
        stripped = stripped.substring(0, stripped.length - 1);
        if (typeof this.state.data[stripped.split('.')[0]] === 'undefined') {
            return 'undefined' //This saves us from from crashing when user tries to user data.key.subkey where data.key is not defined. Also leaves n-for alone
        }
        return eval('this.state.data.' + stripped);
    }

    removeWhiteSpaceFromString(str: string) {
        return str.replace(/\s/g, "");
    }
    stripAndTrimInterpolation(interpolation: string) {
        if (typeof interpolation === 'undefined' || typeof interpolation === null) return interpolation;
        interpolation = interpolation.replace('{{', '');
        interpolation = interpolation.replace('}}', '');
        interpolation = interpolation.trim();
        return interpolation;
    }
    getInterpolationsForTextContent(text: string) {
        var interpolations :string[] = [];
        if (typeof text === 'undefined' || text === null) return interpolations;
        //text may come in this format 'hi, this is {{test}} and this is {{abc}}'
        var matches = text.match(/{{(.?\s?\w?.?\w\s?)+}}/g); //TODO: Regex is not perfect. May start with .
        if (matches === null) return [];
        for (var match of matches) {
            interpolations.push(match);
        }
        return interpolations;
    }
    getObjectReferenceByInterpolationName(interpolation:string) {
        interpolation = this.stripAndTrimInterpolation(interpolation);
        return this.state.data[interpolation]; //Handle interpolations with . inside
    }

    interpolateOnTextWithState(text:string, state:State) {

    }
    getContentOfNodeIfTextNodeExists(node: Node) : string{
        if (node.nodeType === 3) {
            return node.nodeValue;
        }
        if (node.childNodes.length === 0) return null;
        if (this.nodeHasTextNodeAsADirectChild(<HTMLElement>node)) {
            for (var child of node.childNodes) {
                if (this.getContentOfNodeIfTextNodeExists(child) !== null) {
                    return this.getContentOfNodeIfTextNodeExists(child);
                }
            }
        }
    }

    setContentOfTextNode(node: Node, value: string) {
        if (node.nodeType !== 3) {
            console.error('setContentOfTextNode... this implies that you *HAVE* to provide nothing else than a textNode as argument.');
            return false;
        }
        node.nodeValue = value;
        return true;
    }
    updateInterpolatedElement(ref: HTMLElement, originalText: string) {
        this.executeDirectivesOnElement(ref, false);
        console.log(originalText)
        var interpolations = this.getInterpolationsForTextContent(originalText);
        console.log(interpolations)
        if (interpolations.length === 0) return;
        var interpolatedText = originalText;
        for (var interpolation of interpolations) {
            var value = this.getValueOfInterpolation(interpolation);

            if (this.isElementDisabled(this.stripAndTrimInterpolation(interpolation), ref)) {
                continue;
            }

            interpolatedText = interpolatedText.replace(interpolation, value);
        }



        console.log('updating: ' + interpolatedText)

        ref.textContent = interpolatedText;

    }
    isDescendant(parent: HTMLElement, child: HTMLElement) {

        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    isElementDisabled(name: string, element: HTMLElement) {
        for (var disabled of this.state.disabledElements) {
            if (this.isDescendant(element, disabled.element) || this.isDescendant(disabled.element, element)) {
                if (name.includes(disabled.content)) return true; //Edge case, we have a f***ing scope
            }
            if (disabled.content === name && disabled.element === element) {
                return true;
            }
        }
        return false;
    }
    interpolateElement(element: HTMLElement, interpolations: string[]) {

        for (var interpolation of interpolations) {
            this.state.disableElementIfNeeded(element);
            var value = this.getValueOfInterpolation(interpolation);
            if (this.isElementDisabled(this.stripAndTrimInterpolation(interpolation).trim(), element)) {
                continue;
            }

            let text = element.textContent || element.textContent;
            text = text.replace(interpolation, value);

            if ('textContent' in element) {
                element.textContent = text;
                continue;
            }
        }
        return element;
    }

    nodeHasTextNodeAsAChild(element: HTMLElement): boolean {
        if (element.nodeType === 3) return true;
        if (element.childNodes.length === 0) return false;
        return this.nodeHasTextNodeAsAChild(element);
    }

    nodeHasTextNodeAsADirectChild(element: HTMLElement) {
        for (var child of element.childNodes) {
            if (child.nodeType === 3) {
                return true;
            }
        }
        return false;
    }
    isTextNode(element: Node) {
        return element.nodeType === 3;
    }
    sanitize(string: string) {
        if (typeof string !== 'string') return string;
        var temp = document.createElement('div');
        temp.textContent = string;
        var san = temp.innerHTML;
        return san;
    }

    executeInerpolationsOnElement(element: HTMLElement) {

        for (var child of element.childNodes) {
            this.executeInerpolationsOnElement(<HTMLElement>child);
        }

        var interpolations = this.getInterpolationsForTextContent(element.nodeValue);

        if (this.isTextNode(element)) {
            //Interpolation should only happen on a text node. Otherwise, DOM may be damaged. 

            if (interpolations.length === 0) {
                return; //No interpolations on this element
            }


            if (element.nodeType !== 3) {
                return;
            }

            for (let interpolation of interpolations) {

                this.state.addActiveElement(<HTMLElement>element, this.getObjectReferenceByInterpolationName(interpolation), element.nodeValue, interpolation);
            }
            this.interpolateElement(<HTMLElement>element, interpolations);
        } else {
            //Special case: Nfor. We do have to add them, but if this else getts extended for some reason, reconsider this.
            if (!this.isNForActivated(<HTMLElement>element)) return;

            let el = <HTMLElement>element;
            let interpolation = "{{" + el.getAttribute('n-for').split(' ')[3] + "}}"
            this.state.addActiveElement(el, el.getAttribute('n-for').split(' ')[3], null, interpolation);


        }
    }





}
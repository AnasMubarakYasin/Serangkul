import { ObserveableAttrNode, ObserveableChildNodes, ObserveableTextNode, ObserveableNode } from './observeable-node.js';
import { Obserify, ObserifyListInstance, ObserifyMapInstance, ObserifyValueInstance } from './observeable-data.js'

type TemplateInit = {
    string: string;
    args: Array<any>;
    index: number;
    indexArgs: number[];
    length: number;
}

type TemplateComponent = (attribute: any, children: any[]) => Element;
type TemplateStream = (stream: TemplateTransformStream) => void | ObserifyListInstance<unknown> | ObserifyMapInstance<any>;
type EventHandler = (event: any) => void;
type Primitive = string | number | boolean | symbol;

type AttributePreset = {
    [key: string]: (Primitive | ObserifyValueInstance<Primitive>)[] | Primitive | ObserifyValueInstance<Primitive>
}
type TemplatePreset = {
    tag: string | TemplateComponent;
    attributes: AttributePreset;
    type: 'element' | 'text';
    text: string | ObserifyValueInstance<Primitive>;
    children: TemplatePreset[];
}
type TemplateIn = Primitive | TemplateComponent | ObserifyValueInstance<any> | EventHandler | TemplateStream;

export type TemplateTransform = (templateString: TemplateStringsArray, ...templateIn: TemplateIn[]) => TemplatePreset;
export type TemplateTransformStream = (templateString: TemplateStringsArray, ...templateIn: TemplateIn[]) => void;

const TAG = 0;
const KEY = 1;
const VALUE = 2;
const ELEMENT = 3;
const CHILD = 4;
const ARG = '$';
const mapId = new Map<Symbol, Element>();

export function html(stringLiterals: TemplateStringsArray, ...templateList: TemplateIn[]) {
    return transformCore(buildTemplate(stringLiterals, templateList));
}


html.registerElement = function (symbol: Symbol, element: Element) {
    mapId.set(symbol, element);
};
html.getElement = function (symbol: Symbol) {
    return mapId.get(symbol);
};
html.getStream = function () {
    const buffer: TemplatePreset[] = [];
    return {
        buffer,
        restart() {
            this.buffer.length = 0;
        },
        stream(stringArray: TemplateStringsArray, ...args: any[]) {
            const template = buildTemplate(stringArray, args);
            const length = template.length;
            while (template.index < length) {
                buffer.push(transformCore(template));
            }
        },
        render() {
            const nodeList = []
            for (const preset of buffer) {
                nodeList.push(render(preset));
            }
            buffer.length = 0;
            return nodeList
        }
    }
}

export function render(preset: TemplatePreset, selector?: string | Element): Element | DocumentFragment {
    const typeElement = typeof preset.tag;
    let element: Element | DocumentFragment | null = null;
    if (typeElement == 'string') {
        if (preset.tag == '') {
            element = document.createDocumentFragment();
        } else {
            element = document.createElement(preset.tag as string);
        }
    } else if (typeElement == 'function') {
        element = (preset.tag as TemplateComponent)(preset.attributes, preset.children);
    } else {
        throw new TypeError('unknown type tag: ' + preset.tag);
    }
    for (const [key, values] of Object.entries(preset.attributes)) {
        if (key[0] == 'o' && key[1] == 'n') {
            const inject = [];
            if (Array.isArray(values)) {
                inject.push(...values);
            } else {
                inject.push(values);
            }
            element.addEventListener(key.slice(2), ...inject);
        } else if (key[0] == 'i' && key[1] == 'd') {
            if (values instanceof Array) {
                if (typeof values[0] == 'symbol') {
                    html.registerElement(values[0], element);
                    element.id = values.shift()?.toString() as string;
                }
                element.id += values.join('');
            } else {
                element.id = values.toString();
            }
        } else {
            let accumulation = '';
            let observeableData: ObserifyValueInstance<Primitive> | null = null;
            if (Array.isArray(values)) {
                for (const value of values) {
                    const type = typeof value;
                    if (type == 'string' || type == 'number' || type == 'boolean') {
                        accumulation += value.toString();
                    } else if (value instanceof Obserify.Value) {
                        if (observeableData) {
                            throw new Error('Cannot use multiply observeable on a attribute: ' + key);
                        } else {
                            observeableData = value;
                            accumulation += value;
                        }
                    } else {
                        throw new TypeError('unknown type value: ' + values);
                    }
                }
            } else {
                accumulation = JSON.stringify(values);
            }
            if (observeableData) {
                const observeableNode = new ObserveableAttrNode(key, accumulation);
                observeableData.subscribe((value) => observeableNode.set(value.toString()));
                observeableNode.attachTo(element).observe((info) => observeableData?.set(info.newValue));
            } else {
                element.setAttribute(key, accumulation);
            }
        }
    }
    for (const child of preset.children) {
        if (child.type == 'text') {
            const text = child.text as unknown;
            if (text instanceof Obserify.Value) {
                const observeableNode = new ObserveableTextNode(text as unknown as string);
                text.subscribe((value) => observeableNode.set(value));
                observeableNode.attachTo(element).observe((value) => text.set(value.newValue));
            } else if (typeof text == 'function') {
                const hStream = html.getStream();
                const observeableData = text(hStream.stream);
                const nodeList: (string | Node)[] | HTMLCollection = hStream.render();
                if (observeableData instanceof Obserify.List) {
                    const observeableNode = new ObserveableChildNodes(...nodeList);
                    observeableNode.attachTo(element).observe((info) => {
                        if (info.newValue.event == 'unknown') {
                            text(hStream.stream);
                            observeableNode.set(hStream.render());
                        } else {
                            info.cancelChanged = true;
                        }
                    });
                    observeableData.subscribe((value) => {
                        text(hStream.stream);
                        observeableNode.set(hStream.render());
                    });
                } else if (observeableData instanceof Obserify.Map) {
                    console.log('map');
                    const observeableNode = new ObserveableNode(nodeList.shift() as Element);
                    observeableNode.attachTo(element).observe((info) => {
                        // info.cancelChanged = true;
                    });
                    observeableData.subscribe((value) => {
                        text(hStream.stream);
                        observeableNode.set(hStream.render().shift() as Element);
                    })
                } else {
                    element.append(...nodeList);
                }
            } else {
                element.append(child.text.toString());
            }
        } else {
            element.append(render(child));
        }
    }
    if (selector) {
        if (typeof selector == 'string') {
            document.querySelector(selector)?.append(element);
        } else {
            selector.append(element);
        }
    }
    return element;
}

function buildTemplate(strings: TemplateStringsArray, args: any[]) {
    const indexArgs: number[] = [];
    let length = strings.length;
    let string = strings[0].trimStart();
    for (let index = 1; index < length; index++) {
        indexArgs.push(string.length);
        string += ARG + strings[index];
    }
    string = string.trimEnd();
    length = string.length;
    return { string, args, index: 0, indexArgs, length };
}

function transformCore(template: TemplateInit) {
    const string = template.string;
    const stringLength = template.length;
    let buffer = '';
    let context = TAG;
    let root: TemplatePreset | null = null;
    for (let index = template.index; index < stringLength; index++) {
        const char = string[index];
        if (char == '\n') {
            continue;
        }
        if (char == ' ' && string[index + 1] == ' ') {
            index++;
            continue;
        }
        if (char == '<') {
            if (context == TAG) {
                root = { tag: '', attributes: {}, text: '', children: [], type: 'element' };
                let key = '';
                let value = [];
                let quoteCount = 0;
                let spaceCount = 0;
                for (++index; index < stringLength; index++) {
                    const char = string[index];
                    if (char == '\n') {
                        continue;
                    }
                    if (char == ' ' && string[index + 1] == ' ') {
                        index++;
                        continue;
                    }
                    if (char == ' ') {
                        spaceCount++;
                        if (quoteCount) {
                            value.push(buffer, char);
                        } else {
                            if (spaceCount > 1) {
                                if (key += buffer) {
                                    addProperty(root.attributes, key, value);
                                    key = '';
                                    value = [];
                                }
                            } else {
                                root.tag += buffer;
                            }
                            context = KEY;
                        }
                        buffer = '';
                    } else if (char == '=' && quoteCount == 0) {
                        key = buffer;
                        buffer = '';
                        context = VALUE;
                    } else if (char == '"') {
                        quoteCount++;
                        if (quoteCount == 2) {
                            quoteCount = 0;
                            value.push(buffer);
                            buffer = '';
                            context = KEY;
                        }
                    } else if (char == '>') {
                        if (string[index - 1] == '/') {
                            buffer = buffer.slice(0, -1);
                            template.index = index + 1;
                            index = stringLength;
                        }
                        if (context == KEY) {
                            if (key || (key = buffer)) {
                                addProperty(root.attributes, key, value);
                            }
                        } else if (quoteCount == 0) {
                            if (buffer) {
                                root.tag += buffer;
                            }
                        }
                        buffer = '';
                        context = CHILD;
                        break;
                    } else if (char == ARG) {
                        if (template.indexArgs[0] == index) {
                            template.indexArgs.shift();
                            const arg = template.args.shift();
                            if (context == VALUE) {
                                buffer = buffer ? buffer + arg : arg;
                            } else if (context == KEY) {
                                if (buffer[0] == '.' && buffer[2] == '.') {
                                    addProperties(root.attributes, arg);
                                    buffer = ''
                                } else {
                                    buffer += arg;
                                }
                            } else if (context == TAG) {
                                if (buffer) {
                                    root.tag = buffer + arg;
                                    buffer = '';
                                } else {
                                    root.tag = arg;
                                }
                            } else {
                                throw new SyntaxError('unknown type on element: ' + arg);
                            }
                        }
                    } else {
                        buffer += char;
                    }
                }
            } else {
                if (buffer) {
                    root.children.push({ tag: '', attributes: {}, text: buffer, children: [], type: 'text' });
                }
                if (string[index + 1] == '/') {
                    if (string[index + 2] == '>') {
                        index += 3;
                    } else {
                        index += 3 + root.tag.length;
                    }
                    template.index = index;
                    break;
                } else {
                    template.index = index;
                    root.children.push(transformCore(template));
                    index = template.index;
                }
                buffer = '';
            }
        } else if (char == ARG) {
            if (template.indexArgs[0] == index) {
                template.indexArgs.shift();
                const arg = template.args.shift();
                if (context == CHILD) {
                    if (string[index - 1] == '.' && string[index - 3] == '.') {
                        root.children.push(...arg);
                        buffer = buffer.slice(0, buffer.length - 3);
                    } else {
                        root.children.push(
                            { tag: '', attributes: {}, children: [], text: arg, type: 'text' }
                        );
                    }
                    if (buffer) {
                        root.children.splice(-1, 0, { tag: '', attributes: {}, children: [], text: buffer, type: 'text' });
                        buffer = '';
                    }
                } else {
                    throw new SyntaxError('unknown type on child context: ' + arg);
                }
            } else {
                console.warn(template);
                console.warn(char, index, template.indexArgs[0], stringLength)
            }
        } else {
            buffer += char;
        }
    }
    return root as TemplatePreset;
}

function addProperty(object: object, key: string, value: any, descriptor = {
    configurable: true,
    enumerable: true,
    writable: true,
    value: null,
}) {
    descriptor.value = value;
    return Object.defineProperty(object, key, descriptor);
}
function addProperties(object: object, objectToCopy: object) {
    for (const [key, value] of Object.entries(objectToCopy)) {
        addProperty(object, key, value);
    }
    return object;
}
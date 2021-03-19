type NodeElement = 1
type NodeAttr = 2;
type NodeText = 3
type NodeType = NodeElement | NodeAttr | NodeText | number;
type NotifyInfo<T> = {
    newValue: T;
    oldValue: T;
    data?: any[];
    cancelChanged: boolean;
    stopPropagation: boolean;
}
type ObserverHandler<T> = (info: NotifyInfo<T>) => void;
type ChangeInfo = {
    event: 'add' | 'remove' | 'unknown'
    method: 'push' | 'pop' | 'unshift' | 'shift' | 'splice' | 'set';
    parameter: (string | number | Node | NodeList)[];
    length: number;
}
type Predicate = (value: Element, index: number) => boolean;
type Compare = (a: Element, b: Element) => number;

abstract class ObserveableUnsafe<Value, VHandler = Value> {
    get Class() {
        return ObserveableUnsafe;
    }

    abstract observer: MutationObserver;
    abstract typeValue: string;
    abstract prevValue: Value;

    observerHandlerList: ObserverHandler<VHandler>[] = [];

    abstract attachTo(element: Element): void;
    abstract set(value: Value): void
    abstract get(): Value
    abstract disconnect(): void;

    observe(handler: ObserverHandler<VHandler>) {
        if (typeof handler == 'function') {
            this.observerHandlerList.push(handler);
        } else {
            throw new TypeError('Type handler must be a function');
        }
    }

    unobserve(handler: ObserverHandler<VHandler>) {
        if (typeof handler == 'function') {
            let index = 0;
            for (const observerHandler of this.observerHandlerList) {
                if (Object.is(observerHandler, handler)) {
                    this.observerHandlerList.splice(index, 1);
                    return true;
                }
                index++;
            }
            return false;
        } else {
            throw new TypeError('Type handler must be a function');
        }
    }

    protected notify(info: NotifyInfo<VHandler>) {
        const startTime = Date.now();
        let canceled = false;
        for (const handler of this.observerHandlerList) {
            handler(info);
            if (info.cancelChanged && canceled == false) {
                console.warn('changed cancel');
                this.set(this.prevValue);
                canceled = true;
            }
            if (info.stopPropagation) {
                console.warn('notify stop');
                break;
            }
        }
        console.log(this.constructor.name, 'take time notify', (Date.now() - startTime), 'ms');
    }
}

export class ObserveableTextNode extends ObserveableUnsafe<string> {
    prevValue: string;
    typeValue: string;
    nodeType: NodeType;
    observer: MutationObserver;

    private node: Text;
    private element: Element | null = null;
    constructor(value = '') {
        super();

        this.typeValue = typeof value
        this.node = document.createTextNode(value);
        this.prevValue = value;
        this.nodeType = this.node.nodeType;
        this.observer = new MutationObserver((mutations) => {
            console.log('text', mutations);
            for (const mutation of mutations) {
                this.notify({
                    newValue: mutation.target.textContent as string,
                    oldValue: mutation.oldValue ?? '',
                    cancelChanged: false,
                    stopPropagation: false
                });
            }
        });
    }
    attachTo(element: Element) {
        this.observer.disconnect();
        this.element = element;
        element.append(this.node);
        this.observer.observe(this.node, { characterData: true, characterDataOldValue: true, childList: true });
        return this;
    }
    set(value: string) {
        if (this.node.textContent != value) {
            this.node.textContent = value
        }
        return this;
    }
    get() {
        return this.node.textContent as string;
    }
    disconnect() {
        this.observer.disconnect();
    }
}
export class ObserveableAttrNode extends ObserveableUnsafe<string> {
    prevValue: string;
    observer: MutationObserver;
    typeValue: string;
    name: string;
    length: number;

    private node: Attr;
    private element: Element | null = null;
    private list: string[]
    constructor(key: string, value = '') {
        super();

        this.name = key;
        this.typeValue = typeof value;
        this.list = [value];
        this.prevValue = value;
        this.length = this.list.length;
        this.node = document.createAttribute(key);
        this.observer = new MutationObserver((mutations) => {
            console.log('attr', mutations);
            for (const mutation of mutations) {
                this.notify({
                    newValue: this.node.value,
                    oldValue: mutation.oldValue as string,
                    cancelChanged: false,
                    stopPropagation: false,
                });
            }
        });
        this.update();
    }
    private update() {
        this.set(this.list.join(' '));
    }
    attachTo(element: Element) {
        this.observer.disconnect();
        this.element = element;
        element.setAttributeNode(this.node);
        this.observer.observe(element, { attributeFilter: [this.node.name], attributeOldValue: true });
        return this;
    }
    set(value: string | number | boolean) {
        if (value != this.node.value) {
            this.node.value = value + '';
        }
        return this;
    }
    get() {
        return this.node.value as string;
    }

    item(index: number): string {
        if (index > -1 && index < this.length) {
            return this.list[index];
        } else {
            throw new RangeError('index out of bound: ' + index);
        }
    }
    contains(value: string) {
        return this.list.includes(value);
    }
    add(value: string | number | boolean) {
        this.list.push(value += '');
        this.update();
        return this;
    }
    remove(...values: Array<string | number | boolean>) {
        for (const value of values) {
            const index = this.list.indexOf(value + '');
            if (index != -1) {
                this.list.splice(index, 1);
                this.update();
            } else {
                throw new Error('value not found: ' + value);
            }
        }
        return this;
    }
    replace(oldValue: string | number | boolean, newValue: string | number | boolean) {
        const index = this.list.indexOf(oldValue + '');
        if (index != -1) {
            this.list.splice(index, 1, newValue + '');
            this.update();
        } else {
            throw new Error('value not found: ' + oldValue);
        }
        return this;
    }
    supports(): boolean {
        throw new Error('Method not implemented.');
    }
    toggle(value: string, force?: boolean): boolean {
        let exist = this.list.includes(value);
        if (exist || force == false) {
            this.remove(value);
        } else {
            this.add(value);
        }
        return exist;
    }
    keys() {
        return this.list.keys();
    }
    disconnect(): void {
        this.observer.disconnect();
    }
}

export class ObserveableNode<TElement extends Element> extends ObserveableUnsafe<TElement> {
    observer: MutationObserver;
    observerInit: MutationObserverInit = { attributes: true, characterData: true, subtree: true, childList: true };
    typeValue: string;
    prevValue: TElement;
    parent: Element | null;

    private node: TElement;
    constructor(element: TElement) {
        super();

        this.node = element;
        this.typeValue = typeof element;
        this.prevValue = element;
        this.parent = null;
        this.observer = new MutationObserver((mutations) => {
            console.log('element', mutations);
            for (const mutatation of mutations) {
                
            }
        });
    }
    attachTo(element: Element) {
        element.append(this.node);
        this.parent = element;
        this.observer.disconnect();
        this.observer.observe(this.node, this.observerInit);

        return this;
    }
    set(value: TElement) {
        if (this.node.isConnected) {
            if (this.node.replaceWith) {
                this.node.replaceWith(value);
            } else {
                if (this.node.parentElement) {
                    this.node.parentElement.replaceChild(value, this.node);
                } else {
                    throw new Error('element parent not exist');
                }
            }
        }
        this.node = value;
    }
    get(): TElement {
        return this.node;
    }
    render() {
        return this.node;
    }
    disconnect() {
        throw new Error("Method not implemented.");
    }
}

export class ObserveableChildNodes extends ObserveableUnsafe<Array<Node | string> | HTMLCollection, ChangeInfo> {
    prevValue: (string | Node)[] | HTMLCollection;
    observer: MutationObserver;
    observerInit: MutationObserverInit = { attributes: true, characterData: true, subtree: true, childList: true };
    typeValue: string;
    oldValue: ChangeInfo;
    trusted: boolean = false;

    private parent: Node & ParentNode & ChildNode | DocumentFragment;
    constructor(...nodes: Array<Node | string>) {
        super();

        this.prevValue = nodes.slice();
        this.oldValue = { length: nodes.length, method: 'set', parameter: nodes, event: 'add' };
        this.typeValue = typeof nodes;
        this.parent = document.createDocumentFragment();
        this.parent.append(...nodes);
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                const changeInfo: ChangeInfo = {
                    length: this.parent.children.length,
                    method: 'set',
                    parameter: [],
                    event: 'unknown'
                }
                if (mutation.type == 'childList') {
                    let countNode = 0
                    if (countNode = mutation.removedNodes.length) {
                        changeInfo.event = 'remove';
                        if (mutation.previousSibling) {
                            if (mutation.nextSibling) {
                                changeInfo.method = 'splice';
                                changeInfo.parameter.push(1, countNode, mutation.removedNodes.length);
                            } else {
                                changeInfo.method = 'pop'
                            }
                        } else {
                            changeInfo.method = 'shift';
                        }
                    } else {
                        changeInfo.event = 'add';
                        countNode = mutation.addedNodes.length;
                        if (mutation.previousSibling) {
                            if (mutation.nextSibling) {
                                changeInfo.method = 'splice';
                                changeInfo.parameter.push(1, 0, mutation.addedNodes);
                            } else {
                                changeInfo.method = 'pop'
                            }
                        } else {
                            changeInfo.method = 'shift';
                        }
                    }
                }
                this.notify({
                    newValue: changeInfo,
                    oldValue: this.oldValue,
                    cancelChanged: false,
                    stopPropagation: false,
                });
                this.oldValue = changeInfo;
            }
        });
    }
    attachTo(parent: Element): ObserveableChildNodes {
        parent.append(this.parent);
        this.parent = parent;
        this.observer.disconnect();
        this.observer.observe(parent, this.observerInit);
        return this;
    }
    set(nodes: Array<Node | string> | HTMLCollection) {
        this.observer.disconnect();

        let mode: 'add' | 'delete' | 'replace' = 'add';
        if (nodes.length == this.parent.children.length) {
            mode = 'replace';
        } else if (nodes.length < this.parent.children.length) {
            mode = 'delete';
        }
        for (let index = 0; index < nodes.length; index++) {
            const element = this.parent.children[index];
            const node = nodes[index] as Node;
            if (node.isEqualNode(element) == false) {
                if (index == 0) {
                    if (mode == 'add') {
                        this.unshift(node);
                    } else if (mode == 'delete') {
                        this.shift();
                    } else {
                        element.replaceWith(node);
                    }
                } else if (index == nodes.length - 1) {
                    if (mode == 'add') {
                        this.push(node);
                    } else if (mode == 'delete') {
                        this.pop();
                    } else {
                        element.replaceWith(node);
                    }
                } else {
                    if (mode == 'add') {
                        element.replaceWith(node);
                    } else if (mode == 'delete') {
                        element.remove();
                    } else {
                        element.replaceWith(node);
                    }
                }
            }
            // console.log('node', mode, index);
        }
        if (mode == 'delete') {
            this.splice(nodes.length - this.parent.children.length, this.parent.children.length - nodes.length);
        }
        this.prevValue = [...this.parent.children];
        this.observer.observe(this.parent, this.observerInit);
    }
    get() {
        return this.parent.children;
    }
    splice(start = 0, deleteCount = 0, ...nodes: Array<Node | string>) {

        const deleted = [];
        const length = this.parent.children.length;
        let limit = 0;
        if (start < 0) {
            start = length + start;
            limit = start + deleteCount;
        } else {
            limit = deleteCount + start;
        }
        limit = limit > length ? length : limit;
        for (let index = start; index < limit; index++) {
            deleted.push(document.adoptNode(this.parent.children[index]));
        }
        if (nodes.length) {
            const tmp = document.createDocumentFragment();
            tmp.append(...nodes);
            this.parent.insertBefore(tmp, this.parent.children[start]);
        }

        return deleted;
    }
    clear() {

        for (const child of [...this.parent.children]) {
            child.remove();
        }

        return this;
    }
    concat(...nodes: Array<Node | string>) {
        return [...this.parent.children, ...nodes];
    }
    forEach(callBackFunc: (value: Element, index: number) => void) {
        const length = this.parent.children.length;
        const children = this.parent.children;
        for (let index = 0; index < length; index++) {
            callBackFunc(children[index], index);
        }
    }
    push(...nodes: Array<Node | string>) {

        this.parent.append(...nodes);

        return this;
    }
    unshift(...nodes: Array<Node | string>) {

        this.parent.prepend(...nodes);

        return this;
    }
    pop() {

        const element = this.parent.children.item(this.parent.children.length - 1);
        if (element) {
            return document.adoptNode(element);
        }

        return this;
    }
    shift() {

        const element = this.parent.children.item(0);
        if (element) {
            return document.adoptNode(element);
        }

        return this;
    }

    sort(compareFunc: Compare) {
        return [...this.parent.children].sort(compareFunc);
    }
    reverse() {
        return [...this.parent.children].reverse();
    }

    filter(predicate: Predicate) {
        return [...this.parent.children].filter(predicate);
    }
    some(predicate: Predicate) {
        return [...this.parent.children].some(predicate);
    }
    every(predicate: Predicate) {
        return [...this.parent.children].every(predicate);
    }
    find(predicate: Predicate) {
        return [...this.parent.children].find(predicate);
    }
    findIndex(predicate: Predicate) {
        return [...this.parent.children].findIndex(predicate);
    }

    disconnect(): void {
        throw new Error("Method not implemented.");
    }
}

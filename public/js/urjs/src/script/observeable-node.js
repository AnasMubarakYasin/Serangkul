class ObserveableUnsafe {
    constructor() {
        this.observerHandlerList = [];
    }
    get Class() {
        return ObserveableUnsafe;
    }
    observe(handler) {
        if (typeof handler == 'function') {
            this.observerHandlerList.push(handler);
        }
        else {
            throw new TypeError('Type handler must be a function');
        }
    }
    unobserve(handler) {
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
        }
        else {
            throw new TypeError('Type handler must be a function');
        }
    }
    notify(info) {
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
export class ObserveableTextNode extends ObserveableUnsafe {
    constructor(value = '') {
        super();
        this.element = null;
        this.typeValue = typeof value;
        this.node = document.createTextNode(value);
        this.prevValue = value;
        this.nodeType = this.node.nodeType;
        this.observer = new MutationObserver((mutations) => {
            console.log('text', mutations);
            for (const mutation of mutations) {
                this.notify({
                    newValue: mutation.target.textContent,
                    oldValue: mutation.oldValue ?? '',
                    cancelChanged: false,
                    stopPropagation: false
                });
            }
        });
    }
    attachTo(element) {
        this.observer.disconnect();
        this.element = element;
        element.append(this.node);
        this.observer.observe(this.node, { characterData: true, characterDataOldValue: true, childList: true });
        return this;
    }
    set(value) {
        if (this.node.textContent != value) {
            this.node.textContent = value;
        }
        return this;
    }
    get() {
        return this.node.textContent;
    }
    disconnect() {
        this.observer.disconnect();
    }
}
export class ObserveableAttrNode extends ObserveableUnsafe {
    constructor(key, value = '') {
        super();
        this.element = null;
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
                    oldValue: mutation.oldValue,
                    cancelChanged: false,
                    stopPropagation: false,
                });
            }
        });
        this.update();
    }
    update() {
        this.set(this.list.join(' '));
    }
    attachTo(element) {
        this.observer.disconnect();
        this.element = element;
        element.setAttributeNode(this.node);
        this.observer.observe(element, { attributeFilter: [this.node.name], attributeOldValue: true });
        return this;
    }
    set(value) {
        if (value != this.node.value) {
            this.node.value = value + '';
        }
        return this;
    }
    get() {
        return this.node.value;
    }
    item(index) {
        if (index > -1 && index < this.length) {
            return this.list[index];
        }
        else {
            throw new RangeError('index out of bound: ' + index);
        }
    }
    contains(value) {
        return this.list.includes(value);
    }
    add(value) {
        this.list.push(value += '');
        this.update();
        return this;
    }
    remove(...values) {
        for (const value of values) {
            const index = this.list.indexOf(value + '');
            if (index != -1) {
                this.list.splice(index, 1);
                this.update();
            }
            else {
                throw new Error('value not found: ' + value);
            }
        }
        return this;
    }
    replace(oldValue, newValue) {
        const index = this.list.indexOf(oldValue + '');
        if (index != -1) {
            this.list.splice(index, 1, newValue + '');
            this.update();
        }
        else {
            throw new Error('value not found: ' + oldValue);
        }
        return this;
    }
    supports() {
        throw new Error('Method not implemented.');
    }
    toggle(value, force) {
        let exist = this.list.includes(value);
        if (exist || force == false) {
            this.remove(value);
        }
        else {
            this.add(value);
        }
        return exist;
    }
    keys() {
        return this.list.keys();
    }
    disconnect() {
        this.observer.disconnect();
    }
}
export class ObserveableNode extends ObserveableUnsafe {
    constructor(element) {
        super();
        this.observerInit = { attributes: true, characterData: true, subtree: true, childList: true };
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
    attachTo(element) {
        element.append(this.node);
        this.parent = element;
        this.observer.disconnect();
        this.observer.observe(this.node, this.observerInit);
        return this;
    }
    set(value) {
        if (this.node.isConnected) {
            if (this.node.replaceWith) {
                this.node.replaceWith(value);
            }
            else {
                if (this.node.parentElement) {
                    this.node.parentElement.replaceChild(value, this.node);
                }
                else {
                    throw new Error('element parent not exist');
                }
            }
        }
        this.node = value;
    }
    get() {
        return this.node;
    }
    render() {
        return this.node;
    }
    disconnect() {
        throw new Error("Method not implemented.");
    }
}
export class ObserveableChildNodes extends ObserveableUnsafe {
    constructor(...nodes) {
        super();
        this.observerInit = { attributes: true, characterData: true, subtree: true, childList: true };
        this.trusted = false;
        this.prevValue = nodes.slice();
        this.oldValue = { length: nodes.length, method: 'set', parameter: nodes, event: 'add' };
        this.typeValue = typeof nodes;
        this.parent = document.createDocumentFragment();
        this.parent.append(...nodes);
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                const changeInfo = {
                    length: this.parent.children.length,
                    method: 'set',
                    parameter: [],
                    event: 'unknown'
                };
                if (mutation.type == 'childList') {
                    let countNode = 0;
                    if (countNode = mutation.removedNodes.length) {
                        changeInfo.event = 'remove';
                        if (mutation.previousSibling) {
                            if (mutation.nextSibling) {
                                changeInfo.method = 'splice';
                                changeInfo.parameter.push(1, countNode, mutation.removedNodes.length);
                            }
                            else {
                                changeInfo.method = 'pop';
                            }
                        }
                        else {
                            changeInfo.method = 'shift';
                        }
                    }
                    else {
                        changeInfo.event = 'add';
                        countNode = mutation.addedNodes.length;
                        if (mutation.previousSibling) {
                            if (mutation.nextSibling) {
                                changeInfo.method = 'splice';
                                changeInfo.parameter.push(1, 0, mutation.addedNodes);
                            }
                            else {
                                changeInfo.method = 'pop';
                            }
                        }
                        else {
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
    attachTo(parent) {
        parent.append(this.parent);
        this.parent = parent;
        this.observer.disconnect();
        this.observer.observe(parent, this.observerInit);
        return this;
    }
    set(nodes) {
        this.observer.disconnect();
        let mode = 'add';
        if (nodes.length == this.parent.children.length) {
            mode = 'replace';
        }
        else if (nodes.length < this.parent.children.length) {
            mode = 'delete';
        }
        for (let index = 0; index < nodes.length; index++) {
            const element = this.parent.children[index];
            const node = nodes[index];
            if (node.isEqualNode(element) == false) {
                if (index == 0) {
                    if (mode == 'add') {
                        this.unshift(node);
                    }
                    else if (mode == 'delete') {
                        this.shift();
                    }
                    else {
                        element.replaceWith(node);
                    }
                }
                else if (index == nodes.length - 1) {
                    if (mode == 'add') {
                        this.push(node);
                    }
                    else if (mode == 'delete') {
                        this.pop();
                    }
                    else {
                        element.replaceWith(node);
                    }
                }
                else {
                    if (mode == 'add') {
                        element.replaceWith(node);
                    }
                    else if (mode == 'delete') {
                        element.remove();
                    }
                    else {
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
    splice(start = 0, deleteCount = 0, ...nodes) {
        const deleted = [];
        const length = this.parent.children.length;
        let limit = 0;
        if (start < 0) {
            start = length + start;
            limit = start + deleteCount;
        }
        else {
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
    concat(...nodes) {
        return [...this.parent.children, ...nodes];
    }
    forEach(callBackFunc) {
        const length = this.parent.children.length;
        const children = this.parent.children;
        for (let index = 0; index < length; index++) {
            callBackFunc(children[index], index);
        }
    }
    push(...nodes) {
        this.parent.append(...nodes);
        return this;
    }
    unshift(...nodes) {
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
    sort(compareFunc) {
        return [...this.parent.children].sort(compareFunc);
    }
    reverse() {
        return [...this.parent.children].reverse();
    }
    filter(predicate) {
        return [...this.parent.children].filter(predicate);
    }
    some(predicate) {
        return [...this.parent.children].some(predicate);
    }
    every(predicate) {
        return [...this.parent.children].every(predicate);
    }
    find(predicate) {
        return [...this.parent.children].find(predicate);
    }
    findIndex(predicate) {
        return [...this.parent.children].findIndex(predicate);
    }
    disconnect() {
        throw new Error("Method not implemented.");
    }
}

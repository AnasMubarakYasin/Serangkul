class ReactiveUnsafe {
    constructor(data) {
        // protected subscribers: WeakRef<SubscribeHandler<Value>>[] = [];
        this.subscribers = [];
        this[Symbol.isConcatSpreadable] = true;
        this.type = typeof data;
        this.value = data;
    }
    set(value) {
        if (value != this.value) {
            const type = typeof value;
            if (type != this.type) {
                throw new TypeError(`Mismatch on type, expect ${this.type} instead ${type}`);
            }
            this.value = value;
            this.publish(value);
        }
    }
    get() {
        return this.value;
    }
    subscribe(handler) {
        const type = typeof handler;
        if (type == 'function') {
            // this.subscribers.push(new WeakRef(handler));
            this.subscribers.push(handler);
        }
        else {
            throw new TypeError(`Mismatch on type, expect function instead ${type}`);
        }
        ;
    }
    unsubscribe(handler) {
        let index = 0;
        let pos = 0;
        for (const subscriber of this.subscribers) {
            // if (Object.is(subscriber.deref(), handler)) {
            //     pos = index;
            // }
            if (Object.is(subscriber, handler)) {
                pos = index;
            }
            index++;
        }
        if (pos) {
            this.subscribers.splice(pos, 1);
            return true;
        }
        else {
            return false;
        }
    }
    publish(value) {
        const startTime = Date.now();
        for (const subscriber of this.subscribers) {
            // const handler = subscriber.deref();
            const handler = subscriber;
            if (handler) {
                handler(value);
            }
        }
        console.log(this.constructor.name, 'take time publish', (Date.now() - startTime), 'ms');
    }
    [Symbol.toPrimitive](hint) {
        return this.value;
    }
    toJSON(key) {
        return this.value;
    }
}
class ObserifyValue extends ReactiveUnsafe {
}
class ObserifyMap extends ReactiveUnsafe {
    constructor(data) {
        super(data);
        this.size = 0;
        for (const [key, value] of Object.entries(data)) {
            const obserify = new Obserify.Value(value);
            Object.defineProperty(this, key, {
                value: obserify,
                enumerable: true
            });
            obserify.subscribe((value) => this.value[key] = value);
            this.size++;
        }
    }
    set(value) {
        for (const [key, val] of Object.entries(value)) {
            if (!this[key]) {
                throw new RangeError('Key not found: ' + key);
            }
            if (val != this.value[key]) {
                this[key]
                    .set(val);
            }
        }
        this.publish(this.value);
    }
    *[Symbol.iterator]() {
        for (const iterator of Object.entries(this.value)) {
            yield {
                key: iterator[0],
                value: iterator[1]
            };
        }
    }
    async *[Symbol.asyncIterator]() {
        yield* this[Symbol.iterator]();
    }
}
class ObserifyList extends ReactiveUnsafe {
    constructor(...items) {
        super(items);
        this.length = 0;
        this.commitList = [];
        this.stageList = [];
        this.temp = [];
        this.stage(items);
        this.commit();
    }
    stage(change) {
        this.stageList.unshift(change ?? this.temp.slice());
        return this;
    }
    commit() {
        const stage = this.stageList.shift();
        if (stage) {
            this.commitList.unshift(stage);
            this.save(stage);
        }
        else {
            throw new Error('Cannot commit: ' + this.stageList.length);
        }
        return this;
    }
    revert() {
        if (this.commitList.length > 1) {
            this.stageList.unshift(this.commitList.shift());
            this.save(this.commitList[0]);
        }
        else {
            throw new Error('Cannot revert: ' + this.commitList.length);
        }
        return this;
    }
    save(item) {
        this.length = item.length;
        this.value = item.slice();
        this.temp = item.slice();
        this.publish(item.slice());
        return this;
    }
    getStage(unsave = false, index = 0) {
        const length = this.stageList.length;
        if (length < 1 && index > length && index < 0) {
            throw new RangeError('stage: ' + length);
        }
        if (unsave) {
            return this.stageList.shift();
        }
        else {
            return this.stageList[index];
        }
    }
    at(index) {
        if (typeof index != 'number') {
            throw new TypeError('Index type must a number');
        }
        if (index > -1 && index < this.length) {
            return this.temp[index];
        }
        else if ((index = this.length + index) > -1) {
            return this.temp[index];
        }
        else {
            throw new RangeError('Index out of bounds: ' + index);
        }
    }
    pop() {
        this.temp.pop();
        return this.stage();
    }
    push(...items) {
        this.temp.push(...items);
        return this.stage();
    }
    concat(...items) {
        return this.stage(this.temp.concat(...items));
    }
    join(separator) {
        return this.temp.join(separator);
    }
    reverse() {
        this.temp.reverse();
        return this.stage();
    }
    shift() {
        this.temp.shift();
        return this.stage();
    }
    slice(start, end) {
        return this.stage(this.temp.slice(start, end));
    }
    sort(compareFn) {
        this.temp.sort(compareFn);
        return this.stage();
    }
    splice(start, deleteCount, ...rest) {
        this.temp.splice(start, deleteCount, ...rest);
        return this.stage();
    }
    unshift(...items) {
        this.temp.unshift(...items);
        return this.stage();
    }
    indexOf(searchElement, fromIndex) {
        return this.temp.indexOf(searchElement, fromIndex);
    }
    lastIndexOf(searchElement, fromIndex) {
        return this.temp.lastIndexOf(searchElement, fromIndex);
    }
    every(predicate, thisArg) {
        return this.temp.every(predicate, thisArg);
    }
    some(predicate, thisArg) {
        return this.temp.some(predicate, thisArg);
    }
    forEach(callbackfn, thisArg) {
        this.temp.forEach(callbackfn, thisArg);
    }
    map(callbackfn, thisArg) {
        return this.stage(this.temp.map(callbackfn, thisArg));
    }
    filter(predicate, thisArg) {
        return this.stage(this.temp.filter(predicate, thisArg));
    }
    reduce(callbackfn, initialValue) {
        return this.temp.reduce(callbackfn, initialValue);
    }
    reduceRight(callbackfn, initialValue) {
        return this.temp.reduceRight(callbackfn, initialValue);
    }
    find(predicate, thisArg) {
        return this.temp.find(predicate, thisArg);
    }
    findIndex(predicate, thisArg) {
        return this.temp.findIndex(predicate, thisArg);
    }
    fill(value, start, end) {
        return this.stage(this.temp.fill(value, start, end));
    }
    copyWithin(target, start, end) {
        return this.stage(this.temp.copyWithin(target, start, end));
    }
    includes(searchElement, fromIndex) {
        return this.temp.includes(searchElement, fromIndex);
    }
    flatMap(callback, thisArg) {
        return this.stage(this.temp.flatMap(callback, thisArg));
    }
    flat(thisArg, depth) {
        return this.stage(this.temp.flat(thisArg, depth));
    }
    [Symbol.iterator]() {
        return this.temp[Symbol.iterator]();
    }
}
let Obserify = /** @class */ (() => {
    class Obserify {
    }
    Obserify.Value = ObserifyValue;
    Obserify.Map = ObserifyMap;
    Obserify.List = ObserifyList;
    return Obserify;
})();
export { Obserify };

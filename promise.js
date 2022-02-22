const PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED';

const a = 1

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>]'))
    }

    let called = false;

    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, (r) => {
                    if (called) return;
                    called = true;
                    reject(r);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e)
        }
    } else {
        resolve(x);
    }
}

class MyPromise {
    constructor(executor) {
        this.state = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulFilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            this.state = FULFILLED;
            this.value = value;
            // 发布
            this.onFulFilledCallbacks.forEach(fn => void fn());
        }

        const reject = (reason) => {
            this.state = REJECTED;
            this.reason = reason;
            // 发布
            this.onRejectedCallbacks.forEach(fn => void fn());
        }

        executor(resolve, reject);
    }
    // static resolve() {

    // }
    then(onFulFilled, onRejected) {
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

        const promise2 = new MyPromise((resolve, reject) => {
            let x;
            if (this.state === FULFILLED) {
                setTimeout(() => {
                    try {
                        x = onFulFilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0);


            }
            if (this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            }
            if (this.state === PENDING) {
                // 订阅
                this.onFulFilledCallbacks.push(() => {
                    try {
                        x = onFulFilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }

                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        })

        return promise2;
    }
    catch(errorCallback) {
        this.then(null, errorCallback);
    }
}


module.exports = {
    MyPromise
}
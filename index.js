const { MyPromise } = require('./promise.js');

const promise1 = new MyPromise((resolve, reject) => {
    resolve('promise1')
});

let promise2 = promise1.then((value) => {
    // return new Error('error');
    // return Promise.resolve('Promise resolve')
    // return 'then Promise'
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            // resolve('new MyPromise resolve');
            resolve(new MyPromise((resolve, reject) => {
                resolve('new MyPromise resolve');
            }))
        }, 2000);
    })
    // throw Error('error');
}, (reason) => {
    return reason;
});

promise2.then(value => {
    console.log(value);
    // throw Error('error');
}).catch(reason => {
    console.log(reason)
})


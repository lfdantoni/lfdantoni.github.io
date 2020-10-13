// Callback

console.log('%c ------------------ Callbacks -----------------------', 'background-color: white; color: red; font-weight: bold;');

// const processAsync = (param1, param2, callback) => {
//   // do something

//   console.log('init processAsync')

//   // when it finishes
//   // as convention, the first callback param represent an error otherwise false as value
//   callback(false, 'done')

//   console.log('finish processAsync')
// }

// setTimeout(() => console.log('setTimeout'), 0) // I want

// processAsync('hello', 'world', (error, result) => {
//   console.log('processAsync callback', error, result)
// })


// console.log('callback example finished')

/**
 * console.log order?
 * 
 */


// does callback run in parallel?
console.log('%c ------------------ Callbacks run in parallel? -----------------------', 'background-color: white; color: green; font-weight: bold;');

// const func = (callback) => {
//   console.log('func executed!')
//   callback();
// }

// const button = document.createElement('button');
// button.innerText = 'Block Page';
// button.addEventListener('click', () => {
//   // click event callback
//   // See Chrome Task Manager
//   console.log('Block clicked!')

//   func(() => {
//     console.log('func callback: start')
//     for (let index = 0; index < 2000000000; index++) {
      
//     }
//     console.log('func callback: finish')
//   })

// })

// document.body.appendChild(button)


// "Callback Hell"
console.log('%c ------------------ Callback Hell -----------------------', 'background-color: white; color: green; font-weight: bold;');

// func(() => {
//   // do something ...
//   func(() => {
//     // do something ...
//     func(() => {
//       // and so on...
//       // CALLBACK HELL!!!
//     })
//   })
// })


// Promises
console.log('%c ------------------ Promises -------------------------------------', 'background-color: white; color: red; font-weight: bold;');

// const promise = new Promise((resolve, reject) => {
//   console.log('Promise started')

//   const random = Math.random();

//   if(random > 0.5) {
//     resolve('happy end :)')
//   } else {
//     reject('fail sorry :(')
//   }

//   console.log('Promise finished')
// });

// promise
//   .then(result => console.log('Success', result))
//   .catch(error => console.log('Error', error))

// Chain promises
console.log('%c ------------------ Chain Promises -----------------------', 'background-color: white; color: green; font-weight: bold;');

// const promiseA = new Promise((resolve) => resolve('promiseA'))

// All promises success

// promiseA
//   .then((resultA) => new Promise((resolve) => resolve('promiseB')))
//   .then((resultB) => new Promise((resolve) => resolve('promiseC')))
//   .then((resultC) => console.log(resultC))

// One promise was rejected

// promiseA
//   .then((resultA) => new Promise((resolve, reject) => reject('promiseB')))
//   .then((resultB) => new Promise((resolve) => resolve('promiseD')))
//   .then((promiseD) => console.log(promiseD))
//   .catch(error => console.log('Promise Error', error))

console.log('%c ------------------ Promise.all -----------------------', 'background-color: white; color: green; font-weight: bold;');
// Promise.all

// Promise.all([
//   new Promise(resolve => setTimeout(() => resolve('fast'), 100)),
//   new Promise(resolve => setTimeout(() => resolve('slow'), 5000))
// ])
// // .then(results => console.log('Multiple promises:', results))
// .then(([resultFast, resultSlow]) => console.log('Multiple promises:', resultFast, resultSlow))

// Promise.all with a reject
// Promise.all([
//   new Promise((resolve, reject) => setTimeout(() => reject('fast'), 100)),
//   new Promise(resolve => setTimeout(() => resolve('slow'), 5000))
// ])
// .then(([resultFast, resultSlow]) => console.log('Multiple promises:', resultFast, resultSlow))
// .catch(error => console.log('Multiple promises error:', error))
// .finally(() => console.log('finish'))

console.log('%c ------------------ Promise.allSettle -----------------------', 'background-color: white; color: green; font-weight: bold;');
// Promise.allSettle
// Promise.allSettled([
//   new Promise((resolve, reject) => setTimeout(() => reject('fast'), 100)),
//   new Promise(resolve => setTimeout(() => resolve('slow'), 5000))
// ])
// .then(([resultFast, resultSlow]) => console.log('allSettle promises:', resultFast, resultSlow))

console.log('%c ------------------ Promise.race -----------------------', 'background-color: white; color: green; font-weight: bold;');
// Promise.race
// Promise.race([
//   new Promise(resolve => setTimeout(() => resolve('slow'), 5000)),
//   new Promise(resolve => setTimeout(() => resolve('fast'), 100))
// ])
// .then((result) => console.log('Race promises:', result))

// Promise.race([
//   new Promise((resolve, reject) => setTimeout(() => resolve('slow'), 5000)),
//   new Promise((resolve, reject) => setTimeout(() => reject('fast'), 100))
// ])
// .then((result) => console.log('Race promises:', result))
// .catch(error => console.log('Race promises error:', error))

console.log('%c ------------------ Promise.any -----------------------', 'background-color: white; color: green; font-weight: bold;');
// Promise.any
// Promise.any([
//   new Promise((resolve, reject) => setTimeout(() => resolve('slow'), 5000)),
//   new Promise((resolve, reject) => setTimeout(() => reject('fast'), 100))
// ])
// .then((result) => console.log('Any promises:', result))
// .catch(error => console.log('Any promises error:', error))

console.log('%c ------------------ Async/Await -------------------------------------', 'background-color: white; color: red; font-weight: bold;');

// const asyncFunc = async () => {
  
//   return new Promise((resolve, reject) => {
//     setTimeout(() => resolve('done!'), 5000); // alternate with reject
//   })

//   // return 1  // you can return a constant/object
// }

// const awaitFunc = async () => {
//   try {
//     const result = await asyncFunc();

//     console.log('asyncFunc result', result);  
//   } catch(error) {
//     console.log('asyncFunc error', error);  
//   }
// }

// awaitFunc();

console.log('%c ------------------ With Promises -----------------------', 'background-color: white; color: green; font-weight: bold;');

// const asyncPromises = async () => {
//   const result = await Promise.resolve(1)
//                       .then(resp1 => Promise.resolve(2))
//                       .then(resp2 => Promise.resolve(3))
  
//   console.log('asyncPromises result', result)
// }

// asyncPromises()

// Fetch
console.log('%c ------------------ Fetch -------------------------------------', 'background-color: white; color: red; font-weight: bold;');

console.log('%c ------------------ Easy GET -----------------------', 'background-color: white; color: green; font-weight: bold;');

// fetch('https://jsonplaceholder.typicode.com/posts')
//   .then(response => response.json())
//   .then(data => console.log('GET data', data))
//   .catch(error => console.log('GET error', error))

console.log('%c ------------------ Reject on bad requests -----------------------', 'background-color: white; color: green; font-weight: bold;');

// fetch('https://jsonplaceholder.typicode.com/postst') // bad url as example
//   .then(response => {
//     if(!response.ok){
//       return Promise.reject({
//         status: response.status,
//         message: 'Request error'
//       })
//     }

//     return response.json()
//   })
//   .then(data => console.log('GET data', data))
//   .catch(error => console.log('GET error', error))


console.log('%c ------------------ POST -----------------------', 'background-color: white; color: green; font-weight: bold;');

// const headers = new Headers();
// headers.append('Content-Type', 'application/json')

// const request = new Request(
//   'https://jsonplaceholder.typicode.com/posts2', 
//   {
//     method: 'POST',
//     headers,
//     body: JSON.stringify({
//       "userId": 1,
//       "title": "asdasdasd henderit",
//       "body": "saraza body"
//     })
//   }
// );

// fetch(request)
//   .then(response => {
//     console.log(response);
//     return response.json()
//   })
//   .then(json => console.log('Response POST fetch:', json))

// Compact POST request

// fetch('https://jsonplaceholder.typicode.com/posts',
//   {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       "userId": 1,
//       "title": "asdasdasd henderit",
//       "body": "saraza body"
//     })
//   })
//   .then(response => {console.log(response); return response.json()})
//   .then(json => console.log('Response POST fetch:', json))

console.log('%c ------------------ PUT -----------------------', 'background-color: white; color: green; font-weight: bold;');

// fetch('https://jsonplaceholder.typicode.com/posts/1',
//   {
//     method: 'PUT',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       "userId": 1,
//       "title": "asdasdasd henderit",
//       "body": "saraza body 2"
//     })
//   })
//   .then(response => response.json())
//   .then(json => console.log('Response PUT fetch:', json))


console.log('%c ------------------ DELETE -----------------------', 'background-color: white; color: green; font-weight: bold;');

// fetch('https://jsonplaceholder.typicode.com/posts/1',
//   {
//     method: 'DELETE',
//   })
//   .then(response => response.json())
//   .then(json => console.log('Response DELETE fetch:', json))

console.log('%c ------------------ PATCH -----------------------', 'background-color: white; color: green; font-weight: bold;');

// fetch('https://jsonplaceholder.typicode.com/posts/1',
//   {
//     method: 'PATCH',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       "userId": 1,
//       "body": "saraza body 2"
//     })
//   })
//   .then(response => response.json())
//   .then(json => console.log('Response PATCH fetch:', json))

console.log('%c ------------------ JS Classes -------------------------------------', 'background-color: white; color: red; font-weight: bold;');

// class Person {
//   constructor(name, lastname) {
//     this.name = name;
//     this.lastname = lastname;
//   }

//   getPersonName() {
//     return `${this.name} ${this.lastname}`;
//   }
// }

// const person = new Person('Juan', 'Perez')
// console.log(person)
// console.log(person.getPersonName())

// class Citizen extends Person {
//   constructor(name, lastname, dni) {
//     // calls parent (Person) constructor
//     super(name, lastname)
//     this.dni = dni;
//   }

//   // overrides parent method
//   getPersonName() {
//     return `${this.name} ${this.lastname} ${this.dni}`;
//   }

//   getCitizenData() {
//     return `
//       Name: ${this.name};
//       Last Name: ${this.lastname};
//       DNI: ${this.dni};
//     `
//   }
// }

const citizen = new Citizen('Juan', 'Perez', '33.444.111')
console.log(citizen)
console.log(citizen.getPersonName())
console.log(citizen.getCitizenData())


console.log('%c ------------------ AbortController -------------------------------------', 'background-color: white; color: red; font-weight: bold;');

// It allows to abort a fetch call

// const controller = new AbortController();
// const abortSignal = controller.signal;

// const button = document.createElement('button');
// button.innerText = 'Block Page';
// button.addEventListener('click', () => {
//   controller.abort();

// })

// document.body.appendChild(button)

// fetch('https://mdn.github.io/dom-examples/abort-api/sintel.mp4', {signal: abortSignal})
//   .then(response => response.blob())
//   .then(myBlob => {
//     const video = document.createElement('video');
//     video.setAttribute('controls', '');
//     video.src = URL.createObjectURL(myBlob);
//     document.body.appendChild(video);
//   })
//   .catch(error => console.log('GET video error', error))

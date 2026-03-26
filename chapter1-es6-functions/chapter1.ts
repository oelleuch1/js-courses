// Chapter 1 Exercises — Complete the functions

// Medium Level - functions
const numbers1 = [1, 2, 3, 4];
// TODO: multiply each number by 10

const ex1 = numbers1.map((number) => number * 10);
console.log(ex1);

const users1 = [
  { name: "Alice", age: 20 },
  { name: "Bob", age: 30 },
];

// TODO: return only names

const ex2 = users1.map((user) => user.name);
const doubleAge = users1.map((user) => ({
  name: user.name,
  doubleAge: user.age * 2 })
)
console.log(ex2);

const numbers2 = [1, 6, 3, 8, 2];
// TODO: keep numbers > 5

const ex3 = numbers2.filter((number) => number > 5);
console.log(ex3);

const users2 = [
  { name: "Alice", age: 20 },
  { name: "Bob", age: 15 },
];
// TODO: keep users >= 18

const ex4 = users2.find((user) => user.age >= 18);
console.log(ex4);

const numbers3 = [1, 2, 3, 4];
// TODO: sum values

const ex5 = numbers3.reduce((acc, curr) => acc + curr, 0);
console.log(ex5);

const letters = ["a", "b", "a", "c", "a"];
// TODO: count occurrences
 const ex6 = letters.reduce((accumulator, currentValue) =>  {
   if (accumulator[currentValue]) {
     accumulator[currentValue] = accumulator[currentValue] + 1;
   } else {
     accumulator[currentValue] = 1;
   }
   return accumulator;
 }, {})

// First loop:
// accumulator = {}, currentValue = a
// { a: 1 }

//Second loop
// accumulator = { a: 1 }, currentValue: b
// accumulator = { a:1, b: 1 }

// Third loop
// accumulator = { a: 1, b: 1 }, currentValue: a
// accumulator = { a: 2, b: 1 }
console.log('ex6', ex6);

const users10 = [
    { name: "Bob", age: 30 },
  { name: "John", age: 25 },
  { name: "Alice", age: 10 },
]

// get only the adults names (+18 age) ['Bob', 'John']

/** const ex10 = users10.filter(user => user.age >= 18)
    .map((user) => user.name); **/

const ex10Reduce = users10.reduce((acc, curr) => {
  if (curr.age >= 18) {
    acc.push(curr.name);
  }
  return acc;
}, []);

// users10.some(user => user.age >= 18)
const hasUserAdult = users10.reduce((acc, curr) => {
  return acc || (curr.age >= 18);
}, false)

console.log('hasUserAdult', hasUserAdult)

console.log('ex10Reduce', ex10Reduce)

const numbers4 = [5, 12, 8, 130];
// TODO: find first number > 10

const ex7 = numbers4.find((number) => number > 10);
console.log(ex7);

const numbers5 = [1, 2, 3];
// TODO: check if negative exists

const ex8 = numbers5.some((number) => number < 0);
console.log(ex8);

const numbers6 = [1, 2, 3];
// TODO: check if all > 0

const ex9 = numbers6.every((number) => number > 0);
console.log(ex9);

// Advanced Level
const cart = [
  { product: "A", price: 10, qty: 2 },
  { product: "B", price: 5, qty: 4 },
];

const cartResult = {
  // TODO:
  // total: 40,
  // items: [
  //     { product: "A", total: 20 },
  //     { product: "B", total: 20 }
  //   ]
};

// 11. Hard Level
const orders = [
  { userId: 1, amount: 100 },
  { userId: 2, amount: 50 },
  { userId: 1, amount: 200 },
];

const analytics = {
  // TODO:
  // totalRevenue: 350,
  // revenuePerUser: {
  //  1: 300,
  //  2: 50
  // },
  // topUser: 1
};

const orders2 = [
  { userId: 1, amount: 100 },
  { userId: 1, amount: 200 },
  { userId: 2, amount: 50 },
];

// TODO:
// return:
// {
//   1: { total: 300, avg: 150 },
//   2: { total: 50, avg: 50 }
// }

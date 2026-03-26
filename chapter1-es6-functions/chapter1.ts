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
// const doubleAge = users1.map((user) => ({
//   user.name,
//   doubleAge: user.age * 2
// })
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

// const ex6 = letters.reduce((acc, letters) => ({
//   acc[letter]
// }))

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

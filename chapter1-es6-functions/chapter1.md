# Chapter 1 — ES6+ Array Functions (TypeScript)

## Overview

This chapter introduces essential array methods used in modern JavaScript/TypeScript.

---

## map()

### Utility

Transforms each element and returns a new array.

### Example

```ts
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
```

---

## forEach()

### Utility

Executes a function for each element (no return value).

### Example

```ts
numbers.forEach(n => console.log(n));
```

---

## filter()

### Utility

Returns a new array with elements matching a condition.

### Example

```ts
const even = [1,2,3,4].filter(n => n % 2 === 0);
```

---

## reduce()

### Utility

Reduces array into a single value.

### Example

```ts
const sum = [1,2,3].reduce((acc, curr) => acc + curr, 0);
```

---

## find()

### Utility

Returns first matching element.

### Example

```ts
users.find(u => u.id === 1);
```

---

## some()

### Utility

Checks if at least one element satisfies condition.

### Example

```ts
numbers.some(n => n > 10);
```

---

## every()

### Utility

Checks if all elements satisfy condition.

### Example

```ts
numbers.every(n => n > 0);
```

---

## Key Concepts

* Immutability
* Functional programming
* Chaining methods

---

## Summary Table

| Method  | Returns | Use Case       |
| ------- | ------- | -------------- |
| map     | Array   | Transform data |
| forEach | void    | Side effects   |
| filter  | Array   | Select subset  |
| reduce  | Any     | Aggregate      |
| find    | Element | First match    |
| some    | Boolean | Any match      |
| every   | Boolean | All match      |

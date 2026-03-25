# Value vs Reference Types (TypeScript)

## What You Will Learn

- Identify primitive (value) vs reference types.
- Predict how assignment, mutation, and comparison behave.
- Copy data safely to avoid side effects.

---

## Value Types (Primitives)

- `number`, `string`, `boolean`, `null`, `undefined`, `bigint`, `symbol`
- Stored by value; assignment copies the value.

```ts
let a = 5;
let b = a; // copies value 5
a = 7;     // b stays 5
```

---

## Reference Types

- Objects, arrays, functions, classes, `Map`, `Set`, `Date`, `Error`, `Promise`, etc.
- Variables hold a reference to the underlying object.

```ts
const users = ["Ada", "Linus"];
const alias = users;   // same reference
alias.push("Grace");   // users now has 3 items
```

---

## Copying Strategies

- Shallow copy: spread (`{...obj}`, `[...arr]`) or `Array.slice()`.
- Deep copy (structured data): `structuredClone`, `JSON.parse(JSON.stringify(obj))` (limits), manual recursion.

```ts
const original = { nested: { n: 1 } };
const shallow = { ...original };           // nested shares reference
const deep = structuredClone(original);    // nested is independent
```

---

## Equality & Mutation

- Primitives: compared by value (`===`).
- References: `===` compares identity; two different objects with same shape are not equal.
- Mutating a shared reference affects all aliases.

```ts
const p1 = { x: 1 };
const p2 = { x: 1 };
p1 === p2; // false
```

---

## When to Prefer Value or Reference

- Prefer value types for small, immutable facts (flags, counters).
- Use references for collections, entities, and anything that needs shared updates.

---

## Summary Table

| Category   | Examples                                   | Copy Behavior         | Equality Check |
| ---------- | ------------------------------------------ | --------------------- | -------------- |
| Value      | number, string, boolean, null, undefined   | Copies value          | By value       |
| Reference  | object, array, function, class, Map, Date  | Copies reference only | By identity    |

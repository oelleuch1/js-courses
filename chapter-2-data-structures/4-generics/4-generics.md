# TypeScript Generics (Classes, Types, Functions, Interfaces)

## What You Will Learn

- Why generics matter in real projects.
- How to write reusable generic functions.
- How to model data with generic types and interfaces.
- How to build generic classes with constraints.
- How to combine generics with utility types (`Partial`, `Readonly`, `Record`).
- Common mistakes and how to avoid them.

---

## Why Generics?

Generics let you write one reusable implementation that keeps strong type safety for many data types.

Without generics, you often:

- duplicate logic for `string`, `number`, etc.
- lose type safety by using `any`.

With generics, TypeScript infers concrete types when you call your function/class.

```ts
function wrap<T>(value: T): T[] {
  return [value];
}

const a = wrap("hello"); // string[]
const b = wrap(42);      // number[]
```

---

## Generic Functions

Generic functions are the most common entry point.

```ts
function firstItem<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

You can use multiple type parameters:

```ts
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}
```

---

## Generic Constraints (`extends`)

Sometimes a generic must have specific properties.

```ts
function pluckId<T extends { id: string }>(item: T): string {
  return item.id;
}
```

`T extends ...` means "T can be any type that satisfies this shape."

---

## `keyof` with Generics

Safely access object properties by key:

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

`K` is restricted to real keys of `T`, so invalid keys are compile errors.

---

## Generic Interfaces and Type Aliases

```ts
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Use default generic values (`E = string`) to reduce noise for common cases.

---

## Generic Classes

```ts
class Box<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  set(next: T): void {
    this.value = next;
  }
}
```

Each instance decides `T`:

```ts
const nameBox = new Box<string>("Ada");
const countBox = new Box<number>(10);
```

---

## Generics + Utility Types

Common patterns:

```ts
type Patch<T> = Partial<T>;
type Frozen<T> = Readonly<T>;
type ById<T> = Record<string, T>;
```

This is useful for update payloads, immutable views, and dictionaries.

---

## Inference vs Explicit Type Arguments

TypeScript usually infers generic types:

```ts
const ids = wrap(123); // inferred as number[]
```

Sometimes you should be explicit:

```ts
const emptyUsers = [] as Array<{ id: string; name: string }>;
```

---

## Common Pitfalls

- Overusing `any` inside generic code.
- Returning overly broad types like `unknown` when `T` is available.
- Missing constraints when a property is required.
- Using type assertions (`as`) instead of expressing proper constraints.

---

## Real-World Use Cases

- API clients: `fetchJson<T>() => Promise<T>`
- Repositories: `Repository<TEntity, TId>`
- Caches: `Cache<TKey, TValue>`
- Event buses: `emit<TEvent>()`, `on<TEvent>()`
- Form builders: `FormState<TModel>`

---

## Quick Selection Guide

| Need | Generic Pattern |
| ---- | --------------- |
| Reusable function for many value types | `function f<T>(x: T): T` |
| Enforce required property | `T extends { ... }` |
| Safe property access | `K extends keyof T` |
| Reusable response wrapper | `interface Wrapper<T>` |
| Stateful reusable container | `class Store<T>` |
| Two linked generic values | `<K, V>` |

---

## Next Step

Open the exercises file and complete:

- 10 focused feature exercises (functions/types/classes with generics)
- 2 bigger problems where you design your own classes, enums, methods, and types

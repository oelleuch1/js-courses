# Common Reference Types (with Enums)

## What You Will Learn

- Core JS/TS reference types used daily.
- When to pick each type.
- Typical methods and pitfalls.
- When to reach for enums vs union literals.

---

## Map

**Utility**: Key/value store with any key type, preserves insertion order.  
**Core methods**: `set`, `get`, `has`, `delete`, `forEach`.

```ts
const roles = new Map<number, string>([[1, "admin"]]);
roles.set(2, "editor");
```

---

## Set

**Utility**: Unique collection with fast membership checks.  
**Core methods**: `add`, `has`, `delete`, `size`.

```ts
const visited = new Set(["home", "about"]);
visited.add("contact");
```

---

## Class

**Utility**: Blueprint for objects with shared state and behavior.  
**Notes**: Supports access modifiers, inheritance, and `implements` for interfaces.

```ts
class Course {
  constructor(public title: string, private enrolled = 0) {}
  enroll() { this.enrolled += 1; }
}
```

---

## Interface

**Utility**: Type-only contract describing object shapes.  
**Notes**: Extensible and can be merged across declarations.

```ts
interface Identified { id: string; }
interface Student extends Identified { name: string; skills: string[]; }
```

---

## Date

**Utility**: Legacy mutable date/time object (millisecond precision).  
**Tip**: Store timestamps in UTC; avoid mutating shared `Date` instances.

```ts
const now = new Date();
const ms = now.getTime();
```

---

## Promise

**Utility**: Represents the eventual result of an async operation.  
**Patterns**: `await`, chaining, `Promise.all` / `allSettled` / `race`.

```ts
const data = fetch("/api/user").then(r => r.json());
```

---

## Error

**Utility**: Conveys failure information.  
**Common types**: `Error`, `TypeError`, `RangeError`, `SyntaxError`, `AggregateError`.

```ts
throw new TypeError("Expected number");
```

---

## Function

**Utility**: First-class callable objects; can carry properties.  
**Types**: Plain functions, arrow functions, generators, async functions.

```ts
type Mapper = (input: number) => number;
const double: Mapper = x => x * 2;
```

---

## Enum

**Utility**: Small, fixed set of runtime values with strong typing.  
**Kinds**: Numeric (reverse lookup) and string (stable payloads).  
**Patterns**: Feature flags via bit masks, exhaustive switches for state machines.

```ts
enum CourseStage { Draft = "draft", Published = "published" }
function isPublished(stage: CourseStage) {
  return stage === CourseStage.Published;
}
```

---

## Quick Selection Guide

| Need                               | Choose      | Reason                         |
| ---------------------------------- | ----------- | ------------------------------ |
| Key/value with non-string keys     | Map         | Flexible keys, ordered         |
| Unique values + fast lookup        | Set         | Membership O(1)                |
| Shared behavior + state            | Class       | Methods + encapsulation        |
| Documented shape only              | Interface   | Compile-time contract          |
| Timestamps                         | Date        | Built-in parsing/math helpers  |
| Async result                       | Promise     | Composable async abstraction   |
| Reporting failures                 | Error       | Carries message + stack        |
| Reusable behavior chunk            | Function    | First-class callables          |
| Small, shared state machine/flags  | Enum        | Runtime object + type safety   |

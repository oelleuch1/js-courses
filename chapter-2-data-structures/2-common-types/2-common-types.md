# Common Types and Utility Types

## What You Will Learn

- How to use `Map`, `Set`, `interface`, and utility types in product code.
- How to model API and feature states with union/intersection and literal types.
- How to shape existing types with `Pick`, `Omit`, `Readonly`, `Partial`, and `Record`.
- Where to use `unknown`, `never`, and `void` safely.
- How to choose the right type for runtime data flows.

---

## Map

**Utility**: Key/value store with stable insertion order and non-string keys.
**Feature usage**: caches, indexing, counters, grouped analytics.

```ts
const inventory = new Map<string, number>();
inventory.set("sku-1", 10);
```

---

## Set

**Utility**: Unique value collection with fast lookup.
**Feature usage**: deduping ids, active sessions, toggles, allow/block lists.

```ts
const onlineUsers = new Set<string>();
onlineUsers.add("u-10");
```

---

## Interface

**Utility**: Contract for object shape.
**Feature usage**: API contracts, domain entities, config objects.

```ts
interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "member";
}
```

---

## Special Types

### Union Types

Use when a value can be one of several valid shapes.

```ts
type ApiResult = { ok: true; data: string } | { ok: false; error: string };
```

### Intersection Types

Use when an object must satisfy multiple contracts.

```ts
type Audited = { updatedAtMs: number };
type User = { id: string; email: string };
type AuditedUser = User & Audited;
```

### Literal Types

Use for strict allowed values.

```ts
type Env = "dev" | "staging" | "prod";
```

### Tuple Types

Use for ordered fixed-size values.

```ts
type GeoPoint = [lat: number, lng: number];
```

---

## Utility Types

### `Pick<T, K>`

Use when you want a smaller view of an existing type.

```ts
interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "member";
  createdAtMs: number;
}

type UserContact = Pick<UserProfile, "id" | "email">;
```

### `Omit<T, K>`

Use when you want to remove fields from an existing type.

```ts
type CreateUserInput = Omit<UserProfile, "id" | "createdAtMs">;
```

### `Readonly<T>`

Use when data should not be mutated after creation.

```ts
type FrozenUser = Readonly<UserProfile>;
```

### `Partial<T>`

Use for patch/update payloads where every field is optional.

```ts
type UserPatch = Partial<UserProfile>;
```

### `Record<K, V>`

Use for dictionary-like objects with known key shape.

```ts
type FeatureFlags = Record<"search" | "checkout", boolean>;
```

### `unknown`

Use for external/unsafe input, then narrow with checks.

```ts
function parsePayload(payload: unknown) {
  if (typeof payload === "object" && payload !== null) {
    return payload;
  }
}
```

### `void`

Use for functions that do not return meaningful values.

```ts
function logEvent(message: string): void {
  console.log(message);
}
```

---

## Quick Selection Guide

| Need | Choose | Reason |
| ---- | ------ | ------ |
| Fast lookup by key | `Map<K, V>` | Key flexibility and explicit API |
| Uniqueness and membership checks | `Set<T>` | O(1)-like membership semantics |
| Shared object shape contract | `interface` | Clear and composable contracts |
| Small type view from existing model | `Pick<T, K>` | Reuse source type safely |
| Remove fields from existing model | `Omit<T, K>` | Avoid duplicating object types |
| Immutable object contract | `Readonly<T>` | Prevent accidental mutation |
| Patch/update payload | `Partial<T>` | Makes all fields optional |
| Dictionary with known keys | `Record<K, V>` | Simple object-based lookup |
| Multiple possible states | `union` | Models real state machines |
| Compose contracts | `intersection` | Merge responsibilities safely |
| Validate external input | `unknown` | Safe narrowing before usage |
| Enforce exhaustive switch | `never` | Prevent missing cases |

---

## Next Step

Open the exercises file and complete:

- 10 feature-driven exercises using common types and utility types
- 2 bigger design problems where you choose the right type shape yourself

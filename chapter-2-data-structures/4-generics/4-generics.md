# TypeScript Generics - Chapter 4

## Learning Goals

- Understand why generics exist and why they are safer than `any`.
- Write generic functions, type aliases, interfaces, and classes.
- Use generic constraints with `extends`.
- Use `keyof`, indexed access types, and multiple type parameters.
- Model reusable API responses, repositories, caches, queues, forms, and event systems.
- Combine generics with utility types like `Partial`, `Readonly`, `Pick`, `Omit`, and `Record`.
- Know when TypeScript can infer generics and when explicit type arguments help.

---

## 1) Why Generics?

Generics let you write reusable code while keeping the exact type information of the data that enters the function, class, or interface.

Without generics, you usually have two bad options:

- duplicate the same logic for many types
- use `any` and lose type safety

```ts
function toArrayString(value: string): string[] {
  return [value];
}

function wrapNumber(value: number): number[] {
  return [value];
}
```

The implementation is identical. Only the type changes.

With a generic, the type becomes a parameter:

```ts
function wrap<T>(value: T): T[] {
  return [value];
}

const names = wrap("Alice"); // string[] => ['Alice']
const prices = wrap<number>(99); // number[] => [99]
const product = wrap({ id: "P-1", name: "Keyboard" });
// { id: string; name: string }[]

Typescript will try to detect your typing and will auto assign that T to the type of the argument
```

`T` is a type variable. It behaves like a function parameter, but for types.

A generic accepts many types and keeps the specific type.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const firstName = first(["a", "b"]); => // a
// firstName is string | undefined

const anotherFirstName = first([]); => undefined

// firstName.toFixed(2); // invalid: string does not have toFixed
```

Generics are not about making TypeScript weaker. They are about making reusable code stay precise.

---

## 2) Generic Functions

A generic function declares one or more type parameters before its normal parameters.

```ts
function identity<T>(value: T): T {
  return value;
}

const a = identity("hello"); // string
const b = identity(42); // number
```

Most of the time, TypeScript infers `T` from the argument.

```ts
const user = identity({ id: "U-1", email: "a@example.com" });
// T is inferred as { id: string; email: string }
```

### Arrays

```ts
function last<SpecialType>(items: SpecialType[]): SpecialType | undefined {
  return items[items.length - 1];
}

const lastOrderId = last(["O-1", "O-2"]);
const lastAmount = last([10, 20, 30]);
```

The same function works for strings, numbers, objects, dates, or any other type.

### Multiple Generic Parameters

Use multiple type parameters when two or more unknown types are connected.

```ts
type TupleArray = [string, number];
const tuple: TupleArray = ["Hello", 10];

function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const entry = pair("userId", 123); => ['userId', 123]
// [string, number]
```

A common real-world example is a dictionary lookup.

```ts
function createMap<TKey, TValue>(
  entries: Array<[TKey, TValue]>,
): Map<TKey, TValue> {
  return new Map(entries);
}

const prices = createMap([
  ["keyboard", 129],
  ["mouse", 59],
]);

// Map<string, number>
=> Map: {
  keyboad: 129,
  mouse: 59
}
```

### Generic Arrow Functions

```ts
const toArray = <T>(value: T): T[] => {
  return [value];
};

same as:
function toArray<T>(value: T): T[] {
  return [value];
}
```

---

## 3) Generic Constraints

Sometimes a generic function needs a property or method to exist.

This does not work:

```ts
function getId<T extends { id: string }>(item: T): string {
  // return item.id; // invalid: TypeScript does not know T has id
  return item.id;
}

// getId({ id: "123" })
// T = Object({ id: string })
// return: string
```

`T` can be anything. It could be a number, a string, or `null`.

Use `extends` to constrain the allowed shape.

```ts
function getId<T extends { id: string }>(item: T): string {
  return item.id;
}

const userId = getId({ id: "U-1", email: "a@example.com" });
// T = { id: string, email: string }
const productId = getId({ id: "P-1", price: 99 });

// getId({ email: "missing-id@example.com" }); // invalid
```

`T extends { id: string }` means:

- `T` can be any object type
- but it must have an `id` property of type `string`
- TypeScript keeps the rest of the object type too

### Constraint with Reusable Interfaces

```ts
interface Entity {
  id: string;
}

interface Product extends Entity {
  price: number;
  category: string;
}

function indexById<T extends Entity>(items: T[]): Map<string, T> {
  const result = new Map<string, T>();

  for (const item of items) {
    result.set(item.id, item);
  }

  return result;
}

indexById<Product>([{ id: "1", price: 10, category: "c1" }]);
```

Now every indexed item must have an `id`, but it can have any extra fields.

```ts
const users = indexById([
  { id: "U-1", email: "a@example.com" },
  { id: "U-2", email: "b@example.com" },
]);
// Map<string, { id: string; email: string }>
```

---

## 4) `keyof` and Safe Property Access

`keyof T` creates a union of all valid property names of `T`.

```ts
type Product = {
  id: string;
  name: string;
  price: number;
};

type ProductKey = keyof Product;
// "id" | "name" | "price"
const key: ProductKey = "price";
```

Use it to safely read properties.

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const product = { id: "P-1", name: "Keyboard", price: 129 };
// T = { id: string, name: string, price: number }
// K = 'id' | 'name' | 'price'

// K = id => T[id] => string
//

const name = getProperty(product, "name"); => "Keyboard"
const price = getProperty(product, "price"); // number

// getProperty(product, "stock"); // invalid
```

Important detail: the return type is `T[K]`.

That means:

- if `K` is `"name"`, the return type is `string`
- if `K` is `"price"`, the return type is `number`

This is much more precise than returning `T[keyof T]`, which would be `string | number` for this object.

### Updating a Property Safely

```ts
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return {
    ...obj,
    [key]: value,
  };
}

const updated = setProperty(product, "price", 149);

// setProperty(product, "price", "expensive"); // invalid
```

`value` must match the selected property type.

---

## 5) Generic Type Aliases

Generic type aliases are useful for reusable data shapes.

function getId(value = 0)
getId() => value = 0
getId(1) => value = 1

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure<T> = {
  ok: false;
  error: T;
};

type ApiResult<T, E = string> = ApiSuccess<T> | ApiFailure<E>;

// const response = getProductList();

responseSuccess: ApiResult<Product> : {
  ok: true;
  data: product;
}

responseFailure<Product, Record<string, string>> : {
  ok: false;
  error: Record<string, string>;
}

```

`E = string` is a default generic type.

```ts
type ProductResult = ApiResult<{ id: string; name: string }>;
// error defaults to string

type ValidationResult = ApiResult<
  { id: string },
  { field: string; message: string }
>;
```

### Real API Example

```ts
type PaginatedProducts = {
  items: Prouct[];
  page: number;
  pageSize: number;
  total: number;
};

type PaginatedUsers = {
  items: Users[];
  page: number;
  pageSize: number;
  total: number;
};

// With generics
type PaginatedResponse<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
};

type ProductPage = PaginatedResponse<Product>;
type UsersPage = PaginatedResponse<Users>;
```

The pagination metadata is reusable, but the item type stays specific.

---

## 6) Generic Interfaces

Generic interfaces define reusable contracts.

```ts
interface Repository<TEntity, TId> {
  add(entity: TEntity): void;
  getById(id: TId): TEntity | undefined;
  list(): TEntity[];
}

// add(entity: UserEntity ) void
```

This can describe a product repository, user repository, invoice repository, or anything else.

```ts
type UserEntity = {
  id: string;
  email: string;
};

class UserRepository implements Repository<UserEntity, string> {
  private readonly users = new Map<string, UserEntity>();

  add(entity: UserEntity): void {
    this.users.set(entity.id, entity);
  }

  getById(id: string): UserEntity | undefined {
    return this.users.get(id);
  }

  list(): UserEntity[] {
    return Array.from(this.users.values());
  }
}
```

### Generic Interface with Constraints

```ts
interface EntityWithId<TId> {
  id: TId;
}

class InMemoryRepository<TId, TEntity extends EntityWithId<TId>> {
  private readonly entities = new Map<TId, TEntity>();

  save(entity: TEntity): void {
    this.entities.set(entity.id, entity);
  }

  findById(id: TId): TEntity | undefined {
    return this.entities.get(id);
  }
}

type Product = { id: string, price: number }

const productRepo: InMemoryRepository<string, Product> = new  InMemoryRepository<string, Product>();

productRepo.save({ id: "123", price: 99 });
productRepo.findById('100') => undefined
```

The repository does not care if the id is a `string`, `number`, or custom branded type. It only needs the entity to contain that id.

---

## 7) Generic Classes

Generic classes store or process values of a type chosen when the class is used.

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

const nameBox = new Box("Ada"); // Box<string>
const countBox = new Box(10); // Box<number>
```

### Queue Example

```ts
class Queue<T> {
  private readonly items: T[] = [];

  // NOte: shift vs pop
  // arr = [1, 2, 3]
  // arr.pop() => 3
  // arr.shift() => 1

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }
}

type EmailJob = {
  to: string;
  subject: string;
};

const emailQueue = new Queue<EmailJob>();
emailQueue.enqueue({ to: "a@example.com", subject: "Welcome" });
```

`Queue<T>` has one implementation, but a `Queue<EmailJob>` will never accept a `number` by accident.

### Cache Example

```ts
class Cache<TKey, TValue> {
  private readonly store = new Map<TKey, TValue>();

  set(key: TKey, value: TValue): void {
    this.store.set(key, value);
  }

  get(key: TKey): TValue | undefined {
    return this.store.get(key);
  }
}

type Ids = 1 | 2 | 3;

const cache = new Cache<number, number>();

function getCalculatedValue<T extends number>(value: T): number (
  if (cache.get(value)) {
    return cache.get(value)
  }

  const calculated = value*10;
  cache.set(value, calculated);
  return calculated;
)

getCalculatedValue(10) => first time => calculate => 100 => cache: { 10: 100 }
getCalculatedValue(10) => second or higher call => caching => 100
```

---

## 8) Generics with Utility Types

Utility types become much more useful when combined with generics.

### `Partial<T>`

type User = {
id: string,
email: string,
fullName: string
}

type PartialUser = Partial<User>

PartialUser = {
id?: string,
email?: string,
fullName?: string
}

const patchUser: PartialUser = { id: "2" }

`Partial<T>` makes every property optional.

```ts
type UserProfile = {
  id: string;
  displayName: string;
  city: string;
};

function patchProfile<T extends { id: string }>(
  profile: T,
  patch: Partial<Omit<T, 'id'>>,
): T {
  return {
    ...profile,
    ...patch,
  };
}

const user: UserProfile = { id: "2", displayName: "Bob", city: "Paris" };
const patchedUser: Partial<Omit<UserProfile, 'id'>> = { displayName: "Alice", city: "Munich", id: "3" };

patchProfile<UserProfile>(user, patchedUser); =>  { id: "2", displayName: "Alice", city: "Paris" };
```

This is common for update endpoints.

### `Readonly<T>`

`Readonly<T>` prevents mutation through a specific type.

```ts
function freezeView<T>(value: T): Readonly<T> {
  return Object.freeze({ ...value });
}

const readonlyProfile = freezeView({ id: "U-1", name: "Alice" });
// readonlyProfile.name = "Bob"; // invalid
```

### `Pick<T, K>` and `Omit<T, K>`

```ts
type PublicUser<TUser extends { passwordHash: string }> = Omit<
  TUser,
  "passwordHash"
>;

type User = {
  id: string;
  email: string;
  passwordHash: string;
};

type SafeUser = PublicUser<User>;
// { id: string; email: string }
```

`Pick<T, K>` keeps only selected keys.

```ts
function selectFields<T, K extends keyof T>(value: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    result[key] = value[key];
  }

  return result;
}

const publicProduct = selectFields(
  { id: "P-1", name: "Keyboard", cost: 70, price: 129 },
  ["id", "name", "price"],
);
```

Object Typing:

interface IUser {
id: string,
name: string
}

type User = {
id: string,
name: string
}

const user: IUser = { ... }
const user: User = { ... }

type User = {
id: number,
name: string
}

type IndexByUser = Record<Pick<User, 'id'>, User>

const indexByUser = {
1: { id: "1", name: "Bob" },
2: { id: "2", name: "Alice" },
}

### `Record<K, V>`

`Record<K, V>` creates an object type with keys `K` and values `V`.

```ts
type Permission = "read" | "write" | "delete";

const labels: Record<Permission, string> = {
  read: "Can read",
  write: "Can write",
  delete: "Can delete",
};
```

Every permission must be present.

---

## 9) Generic Discriminated Unions

Generics work well with discriminated unions.

```ts
type Result<TValue, TError = string> =
  | { ok: true; value: TValue }
  | { ok: false; error: TError };

function parseJson<T>(raw: string): Result<T> {
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}

const result = parseJson<{ id: string; total: number }>(
  '{"id":"O-1","total":99}',
);

if (result.ok) {
  console.log(result.value.total);
} else {
  console.log(result.error);
}
```

The `ok` property tells TypeScript which branch you are in.

---

## 10) Generic Event Systems

Generics can connect event names to payload types.

```ts
type AppEvents = {
  "cart:item-added": { productId: string; quantity: number };
  "payment:succeeded": { paymentId: string; amount: number };
  "user:logged-in": { userId: string };
};

class EventBus<TEvents extends Record<string, unknown>> {
  private readonly handlers = new Map<
    keyof TEvents,
    Array<(payload: TEvents[keyof TEvents]) => void>
  >();

  on<K extends keyof TEvents>(
    eventName: K,
    handler: (payload: TEvents[K]) => void,
  ): void {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler as (payload: TEvents[keyof TEvents]) => void);
    this.handlers.set(eventName, existing);
  }

  emit<K extends keyof TEvents>(eventName: K, payload: TEvents[K]): void {
    const handlers = this.handlers.get(eventName) ?? [];

    for (const handler of handlers) {
      handler(payload);
    }
  }
}

const bus = new EventBus<AppEvents>();

bus.on("payment:succeeded", (payload) => {
  console.log(payload.amount);
});

bus.emit("cart:item-added", { productId: "P-1", quantity: 2 });

// bus.emit("cart:item-added", { paymentId: "PAY-1" }); // invalid
```

The event name controls the payload type.

---

## 11) Generic Form State

Forms are a strong use case for `keyof` generics.

```ts
type FieldError<TModel> = Partial<Record<keyof TModel, string>>;

type Model = { id: string; value: string, age: number };

FieldError<Model> => { id?: string, value?: string, age?: string }

getValue('age') =>

class FormState<TModel extends Record<string, unknown>> {
  constructor(
    private values: TModel,
    private errors: FieldError<TModel> = {},
  ) {}

  getValue<K extends keyof TModel>(key: K): TModel[K] {
    return this.values[key];
  }

  setValue<K extends keyof TModel>(key: K, value: TModel[K]): void {
    this.values = {
      ...this.values,
      [key]: value,
    };
  }

  setError<K extends keyof TModel>(key: K, message: string): void {
    this.errors = {
      ...this.errors,
      [key]: message,
    };
  }
}

type CheckoutForm = {
  email: string;
  quantity: number;
  acceptTerms: boolean;
};

const checkoutForm = new FormState<CheckoutForm>({
  email: "",
  quantity: 1,
  acceptTerms: false,
});

checkoutForm.setValue("quantity", 2);
// checkoutForm.setValue("quantity", "two"); // invalid

// checkoutForm.setError('age', 'Age is invalid') // invalid
```

---

## 12) Inference vs Explicit Type Arguments

TypeScript usually infers generics from function arguments.

```ts
function makeArray<T>(value: T): T[] {
  return [value];
}

const ids = makeArray("U-1"); // string[]
```

Sometimes inference has too little information.

```ts
const emptyUsers = [];
// any[] unless TypeScript has context
```

Be explicit when the value does not reveal enough.

```ts
type User = {
  id: string;
  email: string;
};

const users: User[] = [];
const userMap = new Map<string, User>();
```

Or specify the generic directly:

```ts
const cache = new Cache<string, User>();
```

### Avoid Unnecessary Explicit Generics

```ts
identity<string>("hello"); // works, but usually noisy
identity("hello"); // preferred
```

Explicit generics are useful when inference is impossible or too broad. Otherwise, let TypeScript infer.

---

## 13) Common Mistakes

### Mistake 1: Using `any` inside generic code

```ts
function badClone<T>(value: T): any {
  return { ...value };
}
```

The caller loses the exact type.

```ts
function clone<T extends object>(value: T): T {
  return { ...value };
}
```

### Mistake 2: Missing a constraint

```ts
function badLabel<T>(item: T): string {
  // return item.name; // invalid
  return "";
}
```

If you need `name`, say it.

```ts
function label<T extends { name: string }>(item: T): string {
  return item.name;
}
```

### Mistake 3: Returning too broad a type

```ts
function badGet<T, K extends keyof T>(obj: T, key: K): T[keyof T] {
  return obj[key];
}
```

This loses precision.

```ts
function goodGet<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Mistake 4: Forcing type assertions

```ts
function risky<T>(value: unknown): T {
  return value as T;
}

const userId: string = 1 as string;
userId.substring(1, 3); // runtime Error

const value = risky<number>("2.002"); => value type is number


// 1.0235.toFixed(2) => "1.02"
value.toFixed(2); // runtime Error
```

This is not real type safety. It is just a promise to the compiler.

Use assertions only at real boundaries like JSON parsing, DOM access, or third-party data. After that boundary, validate or model the type correctly.

---

## 14) Real-World Use Cases

Generics appear constantly in production TypeScript:

- API clients: `fetchJson<T>()`
- response envelopes: `ApiResponse<T>`
- repositories: `Repository<TEntity, TId>`
- caches: `Cache<TKey, TValue>`
- queues: `Queue<TJob>`
- event buses: `EventBus<TEvents>`
- form managers: `FormState<TModel>`
- table components: `DataTable<TRow>`
- state stores: `Store<TState>`
- patch/update helpers: `Partial<T>`

Generics are not advanced decoration. They are how you avoid rewriting the same idea for every domain type.

---

## Quick Selection Guide

| Need                                        | Generic Pattern                  |
| ------------------------------------------- | -------------------------------- |
| Reusable function that preserves input type | `function f<T>(value: T): T`     |
| Reusable array helper                       | `function f<T>(items: T[]): T[]` |
| Require a property                          | `T extends { id: string }`       |
| Safe property key                           | `K extends keyof T`              |
| Return selected property type               | `T[K]`                           |
| Reusable response wrapper                   | `type ApiResponse<T> = ...`      |
| Reusable repository                         | `Repository<TEntity, TId>`       |
| Reusable stateful class                     | `class Store<T>`                 |
| Key/value storage                           | `class Cache<TKey, TValue>`      |
| Update payload                              | `Partial<T>`                     |
| Immutable view                              | `Readonly<T>`                    |
| Dictionary object                           | `Record<TKey, TValue>`           |

---

## Exercises

Open `4-generics.ts`.

The file contains:

- 10 feature-focused exercises
- 3 easy exercises
- 3 medium exercises
- 3 senior exercises
- 1 hard exercise
- 1 mega problem that combines all the generics notions in one large system

The exercise domains include marketplace, finance, SaaS, logistics, analytics, healthcare, content platforms, and event-driven systems.

# Classes and OOP in TypeScript - Chapter 3

## Learning Goals

## 1) Classes Fundamentals

A class is a model for objects that combines:

- state (attributes / fields)
- behavior (methods)

```ts
class User {
  public id: string;
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  rename(nextName: string): void {
    this.name = nextName;
  }
}
```

### Constructor

The constructor runs at object creation time (`new`).

```ts
const u = new User("u1", "Bob");
```

You can also use **parameter properties** to reduce boilerplate:

```ts
class Product {
  constructor(
    public readonly id: string,
    private _price: number
  ) {}

  get price(): number {
    return this._price;
  }
}
```

---

## 2) Visibility and Encapsulation

Visibility controls who can access class members.

- `public`: accessible everywhere (default).
- `private`: only inside the same class.
- `protected`: class + subclasses.

```ts
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    if (initialBalance < 0) throw new Error("Initial balance cannot be negative");
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Deposit must be > 0");
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Withdraw must be > 0");
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  getBalance(): number {
    return this.balance;
  }
}
```

### Why Encapsulation matters

Encapsulation prevents invalid states.

Bad (no protection): external code sets `balance = -1000`.
Good: all updates go through methods that validate rules.

---

## 3) Attributes and Methods

### Attribute types

- Instance attributes: per object.
- Static attributes: shared by class.
- `readonly` attributes: assign once.

```ts
class Order {
  static nextId = 1;

  public readonly id: number;
  public status: "pending" | "paid" = "pending";

  constructor() {
    this.id = Order.nextId++;
  }

  pay(): void {
    this.status = "paid";
  }
}
```

### Method types

- Instance methods (`order.pay()`)
- Static methods (`Order.createDraft()`)
- Getter/setter accessors when you need controlled read/write behavior.

---

## 4) Interfaces and Implementation

An interface defines a contract (shape + behavior expectations).

```ts
interface PaymentGateway {
  charge(userId: string, amount: number): Promise<string>;
}

class StripeGateway implements PaymentGateway {
  async charge(userId: string, amount: number): Promise<string> {
    return `stripe-${userId}-${amount}`;
  }
}
```

### Why interfaces

- define shapes

### Interface extension and composition

```ts
interface HasName {
  name: string;
}

interface HasEmail {
  email: string;
}

interface Contact extends HasName, HasEmail {
  preferredLanguage: "en" | "fr";
}
```

A class can implement multiple interfaces:

```ts
interface CanLog {
  log(message: string): void;
}

interface CanSerialize {
  toJSON(): string;
}

class AuditEvent implements CanLog, CanSerialize {
  constructor(private readonly label: string) {}

  log(message: string): void {
    console.log(`[${this.label}] ${message}`);
  }

  toJSON(): string {
    return JSON.stringify({ label: this.label });
  }
}
```

---

## 5) Inheritance and Reuse

Inheritance is for true specialization (`Child is-a Parent`).

```ts
class NotificationChannel {
  protected channel: string;
}

class EmailChannel extends NotificationChannel {

  constructor() {
    this.channel = "email";
  }

  send(message: string): void {
    console.log("send message by email:", message);
  }
}
```

### `super()` and constructor chaining

```ts
class BaseEntity {
  constructor(public readonly id: string) {}
}

class Customer extends BaseEntity {
  constructor(id: string, public readonly email: string) {
    super(id);
  }
}
```

### Use inheritance carefully

Prefer composition when:

- behavior changes independently
- hierarchy becomes deep or fragile
- subclass breaks parent expectations

---

## 6) Multiple Inheritance vs Multiple Implementation

### Can a class extend multiple classes in TypeScript?

No. A class can extend only one class.

```ts
class A {}
class B {}
// class C extends A, B {} // invalid in TypeScript
```

### What is possible?

- A class can implement multiple interfaces.
- Interfaces can extend multiple interfaces.
- You can use composition/mixins to combine behavior.

This keeps design explicit and avoids many diamond-problem issues from traditional multiple inheritance systems.

---

## 7) Polymorphism

Polymorphism means one API, many implementations.

```ts
interface Notifier {
  send(userId: string, message: string): Promise<void>;
}

class EmailNotifier implements Notifier {
  async send(userId: string, message: string): Promise<void> {
    console.log(`email -> ${userId}: ${message}`);
  }
}

class SmsNotifier implements Notifier {
  async send(userId: string, message: string): Promise<void> {
    console.log(`sms -> ${userId}: ${message}`);
  }
}

async function sendCampaign(notifier: Notifier, users: string[], msg: string) {
  for (const user of users) {
    await notifier.send(user, msg);
  }
}
```

Client code stays unchanged when notifier changes.

---

## 8) Dependency Inversion Principle (DIP)

High-level modules should depend on abstractions, not concrete classes.

Bad:

```ts
class CheckoutService {
  private gateway = new StripeGateway();
}
```

Good (constructor injection + interface):

```ts
interface PaymentProcessor {
  pay(orderId: string, amount: number): Promise<string>;
}

class CheckoutService {
  constructor(private readonly processor: PaymentProcessor) {}

  checkout(orderId: string, amount: number): Promise<string> {
    return this.processor.pay(orderId, amount);
  }
}
```

Benefits:

- testability
- extensibility
- lower coupling

---

## 9) SOLID Principles

### S - Single Responsibility Principle

A class should have one reason to change.

Split `UserService` into:

- `UserValidator`
- `UserRepository`
- `WelcomeEmailSender`

### O - Open/Closed Principle

Open for extension, closed for modification.

Prefer strategy/interfaces over giant switch blocks.

### L - Liskov Substitution Principle

Subtypes must be safely replaceable for base types.

If subclass changes expected behavior contract, inheritance is wrong.

### I - Interface Segregation Principle

Prefer small focused interfaces to one large interface.

Example:

- `ReadableRepository<T>`
- `WritableRepository<T>`

instead of one `Repository<T>` with unrelated methods.

### D - Dependency Inversion Principle

Depend on contracts (`interface`), inject concrete implementations from outside.

---

## 10) Common Design Errors (and Fixes)

- Error: using classes for plain data only.
  Fix: use type aliases/interfaces + functions.

- Error: deep inheritance trees for code reuse.
  Fix: favor composition + smaller services.

- Error: direct dependency instantiation in business classes.
  Fix: constructor injection.

- Error: exposing mutable fields publicly.
  Fix: keep fields private, expose safe methods/getters.

- Error: fat interfaces.
  Fix: split by client use case.

---

## 11) Practical Checklist Before Shipping OOP Code

- Are object invariants protected by encapsulation?
- Is inheritance used only for true `is-a` relationships?
- Can new behavior be added without editing stable code?
- Do high-level modules depend on interfaces?
- Are classes testable with mocks/fakes?
- Are interfaces focused and cohesive?

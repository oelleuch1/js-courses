# Classes and OOP in TypeScript - Chapter 3

## Learning Goals

- Build classes with state, behavior, constructors, visibility modifiers, getters, setters, `readonly`, and `static` members.
- Know when to use classes, interfaces, abstract classes, inheritance, and composition.
- Understand polymorphism through inheritance and interfaces.
- Apply SOLID principles with practical TypeScript examples.

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

- Instance attributes: each object gets its own value.
- Static attributes: one value shared by the class itself.
- `readonly` attributes: assign once.
- Optional attributes: may be missing.
- Private/protected attributes: hide implementation details.

```ts
class Order {
  private static nextId = 1;
  static readonly allowedStatuses = ["pending", "paid", "cancelled"] as const;

  public readonly id: number;
  private _status: "pending" | "paid" | "cancelled" = "pending";
  public note?: string;

  constructor() {
    this.id = Order.nextId++;
  }

  get status(): "pending" | "paid" | "cancelled" {
    return this._status;
  }

  pay(): void {
    if (this._status === "cancelled") {
      throw new Error("Cannot pay a cancelled order");
    }

    this._status = "paid";
  }

  cancel(): void {
    if (this._status === "paid") {
      throw new Error("Cannot cancel a paid order");
    }

    this._status = "cancelled";
  }
}
```

### Method types

- Instance methods (`order.pay()`)
- Static methods (`Order.createDraft()`)
- Getter/setter accessors when you need controlled read/write behavior.

### Static attributes and static methods

`static` members belong to the class, not to one object.

Use static members for:

- constants shared by every instance
- counters or factories
- pure utility behavior strongly related to the class

Do not use static members for data that should be different per object.

```ts
class Invoice {
  private static nextNumber = 1;
  static readonly taxRate = 0.2;

  readonly number: string;

  private constructor(
    public readonly customerId: string,
    public readonly subtotal: number
  ) {
    this.number = `INV-${Invoice.nextNumber++}`;
  }

  static create(customerId: string, subtotal: number): Invoice {
    if (subtotal <= 0) {
      throw new Error("Subtotal must be positive");
    }

    return new Invoice(customerId, subtotal);
  }

  static calculateTotal(subtotal: number): number {
    return subtotal * (1 + Invoice.taxRate);
  }

  get total(): number {
    return Invoice.calculateTotal(this.subtotal);
  }
}

const invoice = Invoice.create("customer-1", 100);
console.log(invoice.number); // "INV-1"
console.log(invoice.total); // 120

// invoice.calculateTotal(100); // invalid: static methods are called on the class
```

### Getters and setters

Use getters/setters when external code needs property-style access but the class must still enforce rules.

```ts
class Temperature {
  constructor(private celsiusValue: number) {}

  get celsius(): number {
    return this.celsiusValue;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Temperature cannot be below absolute zero");
    }

    this.celsiusValue = value;
  }

  get fahrenheit(): number {
    return this.celsiusValue * 1.8 + 32;
  }
}
```

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

- define object shapes
- describe behavior without forcing a specific implementation
- allow dependency injection and polymorphism
- make testing easier with fake implementations

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

## 4.5) Abstract Classes

An abstract class is a base class that cannot be instantiated directly.

Use an abstract class when subclasses share real code, but each subclass must still provide specific behavior.

```ts
abstract class ReportExporter {
  constructor(protected readonly fileName: string) {}

  export(data: string): void {
    const formatted = this.format(data);
    this.save(formatted);
  }

  protected save(content: string): void {
    console.log(`Saving ${this.fileName}: ${content}`);
  }

  protected abstract format(data: string): string;
}

class JsonReportExporter extends ReportExporter {
  protected format(data: string): string {
    return JSON.stringify({ data });
  }
}

class CsvReportExporter extends ReportExporter {
  protected format(data: string): string {
    return `value\n${data}`;
  }
}

const exporter = new JsonReportExporter("report.json");
exporter.export("monthly revenue");

// const base = new ReportExporter("base.txt"); // invalid: abstract class
```

### Abstract class vs interface

Use an `interface` when you only need a contract:

```ts
interface CanExport {
  export(data: string): void;
}
```

Use an `abstract class` when you need:

- shared fields
- shared methods
- protected helper methods
- required methods that subclasses must implement

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

The caller works with a parent type, abstract class, or interface. The actual object decides which implementation runs.

### Polymorphism with inheritance

Here, `describeProduct` accepts a `Product`. It can receive a normal product, a premium product, or any future subclass of `Product`.

```ts
class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number
  ) {}

  toString(): string {
    return `[Product #${this.id}] ${this.name} - EUR ${this.price}`;
  }
}

class PremiumProduct extends Product {
  constructor(
    id: number,
    name: string,
    price: number,
    public readonly category: string
  ) {
    super(id, name, price);
  }

  override toString(): string {
    return `[Premium ${this.category}] ${this.name} - EUR ${this.price}`;
  }
}

function describeProduct(product: Product): string {
  return product.toString();
}

const standardProduct = new Product(1, "Phone", 1000);
const premiumProduct = new PremiumProduct(2, "Pro Phone", 1400, "electronics");

console.log(describeProduct(standardProduct));
console.log(describeProduct(premiumProduct));
```

Important detail: `describeProduct` does not check `if product is PremiumProduct`. It trusts the shared API: every `Product` has `toString()`.

### Polymorphism with abstract classes

Abstract classes are useful when every subtype shares part of the algorithm, but each subtype must customize one step.

```ts
abstract class Discount {
  constructor(public readonly label: string) {}

  apply(price: number): number {
    if (price < 0) {
      throw new Error("Price cannot be negative");
    }

    return this.calculate(price);
  }

  protected abstract calculate(price: number): number;
}

class PercentageDiscount extends Discount {
  constructor(private readonly rate: number) {
    super("percentage");
  }

  protected calculate(price: number): number {
    return price * (1 - this.rate);
  }
}

class FixedDiscount extends Discount {
  constructor(private readonly amount: number) {
    super("fixed");
  }

  protected calculate(price: number): number {
    return Math.max(0, price - this.amount);
  }
}

function calculateFinalPrice(price: number, discount: Discount): number {
  return discount.apply(price);
}

console.log(calculateFinalPrice(100, new PercentageDiscount(0.2))); // 80
console.log(calculateFinalPrice(100, new FixedDiscount(15))); // 85
```

### Polymorphism with interfaces

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

async function main() {
  await sendCampaign(new EmailNotifier(), ["u1", "u2"], "Welcome");
  await sendCampaign(new SmsNotifier(), ["u1", "u2"], "Welcome");
}

main();
```

Client code stays unchanged when notifier changes.

### Why polymorphism matters

Without polymorphism, code often becomes a chain of conditions:

```ts
type NotificationType = "email" | "sms";

function sendBad(type: NotificationType, userId: string, message: string): void {
  if (type === "email") {
    console.log(`email -> ${userId}: ${message}`);
  } else if (type === "sms") {
    console.log(`sms -> ${userId}: ${message}`);
  }
}
```

This becomes harder to maintain each time a new type is added.

With polymorphism, adding push notifications means adding a new class. Existing campaign code does not change:

```ts
class PushNotifier implements Notifier {
  async send(userId: string, message: string): Promise<void> {
    console.log(`push -> ${userId}: ${message}`);
  }
}
```

### Method overriding vs method overloading

Overriding means a subclass replaces a parent method implementation.

```ts
class AnimalSound {
  speak(): string {
    return "generic sound";
  }
}

class DogSound extends AnimalSound {
  override speak(): string {
    return "woof";
  }
}
```

Overloading means one method has multiple call signatures.

```ts
class UserFinder {
  find(id: number): string;
  find(email: string): string;
  find(value: number | string): string {
    if (typeof value === "number") {
      return `find by id ${value}`;
    }

    return `find by email ${value}`;
  }
}
```

Polymorphism is usually about overriding or implementing an interface. Overloading is about accepting different input shapes in one method.

---

## 8) Dependency Inversion Principle (DIP)

High-level modules should depend on abstractions, not concrete classes.

Bad:

```ts
class StripeGateway {
  pay(orderId: string, amount: number): Promise<string> {
    return Promise.resolve(`stripe-payment-${orderId}-${amount}`);
  }
}

class CheckoutService {
  private gateway = new StripeGateway();

  checkout(orderId: string, amount: number): Promise<string> {
    return this.gateway.pay(orderId, amount);
  }
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

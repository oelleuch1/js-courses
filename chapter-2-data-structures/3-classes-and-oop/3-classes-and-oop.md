# Classes and OOP in TypeScript (SOLID + Polymorphism)

## What You Will Learn

- How to design classes that model real product behavior.
- OOP pillars: encapsulation, abstraction, inheritance, polymorphism.
- SOLID principles with practical TypeScript examples.
- How to avoid fragile class hierarchies.

---

## Why Classes in TypeScript?

Use classes when you need:

- state + behavior bundled together
- lifecycle methods and invariants
- domain models that enforce rules

Prefer plain functions/types when data is simple and stateless.

---

## OOP Pillars

## Encapsulation

Hide internal state and expose clear methods.

```ts
class RateLimiter {
  private tokens: number;

  constructor(private readonly capacity: number) {
    this.tokens = capacity;
  }

  consume(): boolean {
    if (this.tokens <= 0) return false;
    this.tokens -= 1;
    return true;
  }
}
```

## Abstraction

Expose what callers need, hide implementation detail.

```ts
interface PaymentGateway {
  charge(userId: string, amount: number): Promise<string>;
}
```

## Inheritance

Share behavior when there is a true "is-a" relationship.

```ts
abstract class NotificationChannel {
  abstract send(message: string): Promise<void>;
}

class EmailChannel extends NotificationChannel {
  async send(message: string): Promise<void> {
    console.log("email:", message);
  }
}
```

## Polymorphism

Different implementations behind one interface/base type.

```ts
async function broadcast(channel: NotificationChannel, message: string) {
  await channel.send(message);
}
```

The caller uses one API while behavior varies by concrete class.

---

## SOLID Principles

## S - Single Responsibility Principle

A class should have one reason to change.

Bad: `UserService` handles validation, persistence, emails, billing.
Good: split into `UserValidator`, `UserRepository`, `WelcomeEmailSender`.

## O - Open/Closed Principle

Open for extension, closed for modification.

Use interfaces and strategy objects so new behavior is added by new classes, not giant `if/else` edits.

## L - Liskov Substitution Principle

Subclasses must be replaceable for their base type without breaking behavior.

If `Square` breaks expectations of `Rectangle#setWidth/setHeight`, inheritance is wrong.

## I - Interface Segregation Principle

Many focused interfaces beat one large "god interface".

Prefer:

- `ReadableRepository<T>`
- `WritableRepository<T>`

instead of one interface with unrelated methods.

## D - Dependency Inversion Principle

High-level modules depend on abstractions, not concrete implementations.

Inject dependencies via constructor parameters using interfaces.

---

## Polymorphism Patterns

## Strategy Pattern

Swap algorithms without changing caller code.

```ts
interface PricingStrategy {
  calculate(subtotal: number): number;
}
```

## Template Method (via abstract class)

Define shared flow in base class, override extension points in subclasses.

## Composition Over Inheritance

Prefer combining small objects over deep class trees.

---

## Access Modifiers and Keywords

- `public`: accessible everywhere.
- `private`: only inside the class.
- `protected`: class + subclasses.
- `readonly`: assign once.
- `abstract`: must be implemented by subclass.

---

## Common Mistakes

- Large classes with many responsibilities.
- Inheritance used for code reuse instead of domain modeling.
- Hard-coded dependencies (`new` inside core classes).
- Missing interfaces around external systems (payment, cache, email).

---

## Quick Design Checklist

- Does each class have a single responsibility?
- Are dependencies injected as interfaces?
- Can I add new behavior without editing stable classes?
- Are I/O concerns separated from domain logic?
- Can one consumer use multiple implementations polymorphically?

---

## Next Step

Open the exercises file and complete:

- 10 feature-driven class/OOP exercises
- 2 bigger design problems focused on SOLID and polymorphism

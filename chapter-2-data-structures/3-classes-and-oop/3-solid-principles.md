
---

## SOLID Principles

### S - Single Responsibility Principle

A class should have one reason to change.

Bad: one class validates data, stores data, and sends email.

```ts
class UserService {
  createUser(email: string): void {
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }

    console.log(`Saving ${email} to database`);
    console.log(`Sending welcome email to ${email}`);
  }
}
```

Good: split responsibilities.

```ts
class UserValidator {
  validateEmail(email: string): void {
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }
  }
}

class UserRepository {
  save(email: string): void {
    console.log(`Saving ${email} to database`);
  }
}

class WelcomeEmailSender {
  send(email: string): void {
    console.log(`Sending welcome email to ${email}`);
  }
}

class UserRegistrationService {
  constructor(
    private readonly validator: UserValidator,
    private readonly repository: UserRepository,
    private readonly emailSender: WelcomeEmailSender
  ) {}

  register(email: string): void {
    this.validator.validateEmail(email);
    this.repository.save(email);
    this.emailSender.send(email);
  }
}
```

### O - Open/Closed Principle

Open for extension, closed for modification.

Bad: every new discount type requires editing this function.

```ts
type DiscountType = "none" | "student" | "vip";

function applyDiscount(type: DiscountType, price: number): number {
  if (type === "student") return price * 0.9;
  if (type === "vip") return price * 0.8;
  return price;
}
```

Good: new discount behavior is added by creating a new class.

```ts
interface PricingRule {
  apply(price: number): number;
}

class NoDiscount implements PricingRule {
  apply(price: number): number {
    return price;
  }
}

class StudentDiscount implements PricingRule {
  apply(price: number): number {
    return price * 0.9;
  }
}

class VipDiscount implements PricingRule {
  apply(price: number): number {
    return price * 0.8;
  }
}

function calculatePrice(price: number, rule: PricingRule): number {
  return rule.apply(price);
}
```

### L - Liskov Substitution Principle

Subtypes must be safely replaceable for base types.

Bad: `Penguin` breaks the promise that every `Bird` can fly.

```ts
class Bird {
  fly(): void {
    console.log("Flying");
  }
}

class Penguin extends Bird {
  override fly(): void {
    throw new Error("Penguins cannot fly");
  }
}

function makeBirdFly(bird: Bird): void {
  bird.fly();
}
```

Good: model the behavior more precisely.

```ts
interface Bird {
  eat(): void;
}

interface FlyingBird extends Bird {
  fly(): void;
}

class Sparrow implements FlyingBird {
  eat(): void {
    console.log("Sparrow eats seeds");
  }

  fly(): void {
    console.log("Sparrow flies");
  }
}

class Penguin implements Bird {
  eat(): void {
    console.log("Penguin eats fish");
  }
}

function makeFlyingBirdFly(bird: FlyingBird): void {
  bird.fly();
}
```

### I - Interface Segregation Principle

Prefer small focused interfaces to one large interface.

Bad: classes are forced to implement methods they do not need.

```ts
interface Repository<T> {
  findById(id: string): T | undefined;
  save(item: T): void;
  delete(id: string): void;
}

class ReadOnlyProductRepository implements Repository<Product> {
  findById(id: string): Product | undefined {
    return undefined;
  }

  save(item: Product): void {
    throw new Error("Read-only repository");
  }

  delete(id: string): void {
    throw new Error("Read-only repository");
  }
}
```

Good: split interfaces by client need.

```ts
interface ReadableRepository<T> {
  findById(id: string): T | undefined;
}

interface WritableRepository<T> {
  save(item: T): void;
}

interface DeletableRepository {
  delete(id: string): void;
}

class ProductReader implements ReadableRepository<Product> {
  findById(id: string): Product | undefined {
    return undefined;
  }
}

class ProductWriter implements WritableRepository<Product> {
  save(item: Product): void {
    console.log(`Saving ${item.name}`);
  }
}
```

Clients now depend only on the behavior they actually use.

### D - Dependency Inversion Principle

Depend on contracts (`interface`), inject concrete implementations from outside.

Bad: business code directly creates the concrete dependency.

```ts
class MySqlOrderRepository {
  save(orderId: string): void {
    console.log(`Saving order ${orderId} in MySQL`);
  }
}

class OrderService {
  private readonly repository = new MySqlOrderRepository();

  placeOrder(orderId: string): void {
    this.repository.save(orderId);
  }
}
```

Good: business code depends on an abstraction.

```ts
interface OrderRepository {
  save(orderId: string): void;
}

class MySqlOrderRepository implements OrderRepository {
  save(orderId: string): void {
    console.log(`Saving order ${orderId} in MySQL`);
  }
}

class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: string[] = [];

  save(orderId: string): void {
    this.orders.push(orderId);
  }
}

class OrderService {
  constructor(private readonly repository: OrderRepository) {}

  placeOrder(orderId: string): void {
    this.repository.save(orderId);
  }
}

const productionService = new OrderService(new MySqlOrderRepository());
const testService = new OrderService(new InMemoryOrderRepository());
```

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

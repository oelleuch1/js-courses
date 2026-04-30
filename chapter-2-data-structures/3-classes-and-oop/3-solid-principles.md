
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
// main
const userService = new UserService();
```

Good: split responsibilities.

```ts
class UserValidator {
  validateEmail(email: string): void {
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }
  }

  validatePhoneNumber(phone: string): void {
    // regex validation
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

// main
const validator = new UserValidator();
const repo = new userRepository();
const sender = new WelcomeEmailSender();

const userService = new UserRegistrationService(validor, repo, sender);
```

### O - Open/Closed Principle

Open for extension, closed for modification.

Bad: every new discount type requires editing this function.

```ts
type DiscountType = "none" | "student" | "vip" | "employee";

function applyDiscount(type: DiscountType, price: number): number {
  if (type === "student") return price * 0.9;
  if (type === "vip") return price * 0.8;
  if (type === "employee") return price * 0.85;
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


class EmployeeDiscount implements PricingRule {
  apply(price: number): number {
    return price * 0.85;
  }
}

calculatePrice(10, new VipDiscount())  => 8;
calculatePrice(10, new EmployeeDiscount()) => 8.5;
```

### L - Liskov Substitution Principle

Subtypes must be safely replaceable for base types.

The rule is not "never use inheritance." 

The rule is: do not create a subtype that removes or breaks behavior promised by the base type.

Bad: `MarketplaceOrder` breaks the promise that every `Order` can be paid and shipped the same way.

```ts
class Order {
  constructor(public readonly id: string, public readonly total: number) {}

  pay(): void {
    console.log(`Charging ${this.total}`);
  }

  ship(): void {
    console.log(`Shipping order ${this.id}`);
  }
}

class MarketplaceOrder extends Order {
  override pay(): void {
    console.log("Payment is handled by the marketplace");
  }

  override ship(): void {
    throw new Error("Marketplace seller ships this order");
  }
}

function completeOrder(order: Order): void {
  order.pay();
  order.ship();
}
```

`completeOrder(new MarketplaceOrder("order-1", 50))` looks valid because `MarketplaceOrder` is an `Order`, but it fails when `ship()` is called. The subtype changed what callers can safely expect.

Good: model the workflow more precisely. A marketplace order is still an order, but it is not a platform-fulfilled order.

```ts
interface Order {
  id: string;
  total: number;
}

interface PayableOrder extends Order {
  pay(): void;
}

interface ShippableOrder extends Order {
  ship(): void;
}

class FullFilmentOrder implements PayableOrder, ShippableOrder {
  constructor(public readonly id: string, public readonly total: number) {}

  pay(): void {
    console.log(`Charging ${this.total}`);
  }

  ship(): void {
    console.log(`Shipping order ${this.id}`);
  }
}

class MarketplaceOrder implements PayableOrder {
  constructor(public readonly id: string, public readonly total: number) {}

  pay(): void {
    console.log(`Charging ${this.total}`);
  }
}

function completeFullfilmentOrder(order: PayableOrder & ShippableOrder): void {
  order.pay();
  order.ship();
}

function completeMarketplaceOrder(order: MarketplaceOrder): void {
  order.pay();
}
```


### I - Interface Segregation Principle

Prefer focused interfaces when different clients need different capabilities.

Do not split every interface automatically. If the methods naturally belong together and all clients need them, one interface is fine:

```ts
interface PaymentProcessor {
  authorize(amount: number): string;
  capture(authorizationId: string): void;
  refund(paymentId: string): void;
}
```

Splitting this into `Authorizer`, `Capturer`, and `Refunder` would usually make the design noisier if every checkout flow needs the complete payment lifecycle.

Split an interface when a class or client is forced to depend on operations it does not use.

Bad: a worker that only sends email must also implement SMS and push notification methods.

```ts
interface NotificationChannel {
  sendEmail(to: string, message: string): void;
  sendSms(to: string, message: string): void;
  sendPush(userId: string, message: string): void;
}

class EmailNotificationChannel implements NotificationChannel {
  sendEmail(to: string, message: string): void {
    console.log(`Email to ${to}: ${message}`);
  }

  sendSms(to: string, message: string): void {
    throw new Error("Email channel cannot send SMS");
  }

  sendPush(userId: string, message: string): void {
    throw new Error("Email channel cannot send push notifications");
  }
}
```

Good: split interfaces by client need.

```ts
interface EmailSender {
  sendEmail(to: string, message: string): void;
}

interface SmsSender {
  sendSms(to: string, message: string): void;
}

interface PushSender {
  sendPush(userId: string, message: string): void;
}

class EmailNotificationChannel implements EmailSender, SmsSender {
  sendEmail(to: string, message: string): void {
    console.log(`Email to ${to}: ${message}`);
  }

    sendSms(to: string, message: string): void {
          console.log(`Sms to ${to}: ${message}`);

    }
}

class SmsNotificationChannel implements SmsSender {
  sendSms(to: string, message: string): void {
    console.log(`SMS to ${to}: ${message}`);
  }
}

function sendOrderReceipt(sender: EmailSender, email: string): void {
  sender.sendEmail(email, "Your order receipt");
}
```

Clients now depend only on the behavior they actually use. The split is useful because email, SMS, and push can be implemented and consumed independently.

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
  constructor(private readonly repository: MySqlOrderRepository) {}

  placeOrder(orderId: string): void {
    this.repository.save(orderId);
  }
}
const sqlRepo = new MySqlOrderRepository();

const orderService1 = new OrderService(sqlRepo);
const orderService2 = new OrderService(sqlRepo);
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

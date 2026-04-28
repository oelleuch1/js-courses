// =============================================================================
// CHAPTER 3 — PART 1 | TypeScript OOP Exercises
// Topics: classes, constructor, attributes, methods, visibility, inheritance,
//         interfaces, implements, advanced interfaces (extends + multiple implements),
//         Map / Set / Array, and special types (unknown, never, any, union, tuple)
// =============================================================================

// =============================================================================
// 🟢 EXERCISE 01 — FILL IN THE BLANKS
// Domain: E-commerce Marketplace — Product Catalog
// =============================================================================
/**
 * CONTEXT
 * -------
 * You are joining the backend team of "ShopHub", a growing online marketplace.
 * Your first task is to model a basic Product entity that will be stored in the
 * product catalog.
 *
 * Every product has:
 *  - a unique id (number)
 *  - a name (string)
 *  - a price (number, in euros)
 *  - a stock quantity (number)
 *  - a private discount rate (number, default 0, between 0 and 1)
 *
 * The Product class must:
 *  1. Expose a constructor that accepts id, name, price and stock.
 *  2. Provide a public method  `applyDiscount(rate: number): void`
 *     that sets the private discount rate (clamp between 0 and 1).
 *  3. Provide a public getter `finalPrice(): number`
 *     that returns price * (1 - discountRate), rounded to 2 decimal places.
 *  4. Provide a public method `restock(quantity: number): void`
 *     that adds the quantity to current stock (reject negative values).
 *  5. Provide a public method `sell(quantity: number): boolean`
 *     that reduces stock if enough units exist, returns true on success.
 *  6. Override `toString()` to return:
 *     "[Product #<id>] <name> — €<finalPrice> (<stock> in stock)"
 *
 * INSTRUCTIONS
 * ------------
 * Fill every blank marked ___. Do NOT change anything else.
 */

class Product {
  public id: number;
  public name: string;
  public price: number;
  public stock: number;
  private discountRate: number; // ← already filled as an example

  constructor(
    id: number, // id
    name: string, // name
    price: number, // price
    stock: number, // stock
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.discountRate = 0;
  }

  applyDiscount(rate: number): void {
    if (rate < 0) rate = 0;
    if (rate > 1) rate = 1;
    this.discountRate = rate;
  }

  get finalPrice(): number {
    return parseFloat((this.price * (1 - this.discountRate)).toFixed(2));
  }

  restock(quantity: number): void {
    if (quantity < 0) return;
    this.stock += quantity;
  }

  sell(quantity: number): boolean {
    if (quantity > this.stock) return false;
    this.stock -= quantity;
    return true;
  }

  toString(): string {
    return `[Product #${this.name}] ${this.price} — €${this.discountRate} (${this.stock} in stock)`;
  }
}

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 01
 * Run: ts-node chapter3-part1-exercises.ts  (uncomment block below)
 * ------------------------------------------------------------------

const p = new Product(1, "Mechanical Keyboard", 129.99, 50);
console.log(p.toString());
// Expected: [Product #1] Mechanical Keyboard — €129.99 (50 in stock)

p.applyDiscount(0.15);
console.log(p.finalPrice);
// Expected: 110.49

console.log(p.sell(10));   // true
console.log(p.stock);      // 40
console.log(p.sell(50));   // false  (not enough stock)

p.restock(-5);             // silently ignored
p.restock(20);
console.log(p.stock);      // 60

p.applyDiscount(1.5);      // clamped to 1
console.log(p.finalPrice); // 0

p.applyDiscount(-0.3);     // clamped to 0
console.log(p.finalPrice); // 129.99

*/

// =============================================================================
// 🟢 EXERCISE 02 — FILL IN THE BLANKS
// Domain: EdTech / Learning Platform — Student Enrollment
// =============================================================================
/**
 * CONTEXT
 * -------
 * "LearnFlow" is an online learning platform. You must model two entities:
 *
 *   Course  — represents a course offered on the platform.
 *   Student — represents a learner who can enroll in courses.
 *
 * COURSE rules:
 *  - Properties: courseId (string), title (string), maxSeats (number),
 *                private enrolledCount (number, starts at 0).
 *  - Method `enroll(): boolean` — increments enrolledCount if seats remain,
 *    returns true on success, false if full.
 *  - Getter `availableSeats: number` — returns maxSeats - enrolledCount.
 *  - Getter `isFull: boolean`.
 *
 * STUDENT rules:
 *  - Properties: studentId (string), name (string),
 *                private enrolledCourses: Course[] (starts empty).
 *  - Method `enroll(course: Course): string` — attempts to enroll in the
 *    course; returns:
 *      · "Enrolled in <title>" on success
 *      · "Already enrolled in <title>" if duplicate
 *      · "Course <title> is full" if no seat
 *  - Method `getCourseList(): string[]` — returns array of course titles.
 *
 * INSTRUCTIONS
 * ------------
 * Fill every blank marked ___. Do NOT change anything else.
 */

class Course {
  public courseId: string;
  public title: string;
  public maxSeats: number;
  private enrolledCount: number; // hint: number

  constructor(courseId: string, title: string, maxSeats: number) {
    this.courseId = courseId;
    this.title = title;
    this.maxSeats = maxSeats;
    this.enrolledCount = 0;
  }

  enroll(): boolean {
    if (this.enrolledCount >= this.maxSeats) return false;
    this.enrolledCount++;
    return true;
  }

  get availableSeats(): number {
    return this.maxSeats - this.enrolledCount;
  }

  get isFull(): boolean {
    return this.enrolledCount >= this.maxSeats;
  }
}

class Student {
  public studentId: string;
  public name: string;
  private enrolledCourses: Course[]; // hint: Course[]

  constructor(studentId: string, name: string) {
    this.studentId = studentId;
    this.name = name;
    this.enrolledCourses = [];
  }

  enroll(course: Course): string {
    const alreadyIn = this.enrolledCourses.some(
      (c) => c.courseId === course.courseId,
    );
    if (alreadyIn) return `Already enrolled in ${course.title}`;

    const success = course.enroll();
    if (!success) return `Course ${course.title} is full`;

    this.enrolledCourses.push(course);
    return `Enrolled in ${course.title}`;
  }

  getCourseList(): string[] {
    return this.enrolledCourses.map((c) => c.title);
  }
}

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 02
 * ------------------------------------------------------------------

const math   = new Course("C001", "Linear Algebra", 2);
const python = new Course("C002", "Python Basics", 30);

const alice = new Student("S001", "Alice");
const bob   = new Student("S002", "Bob");

console.log(alice.enroll(math));   // "Enrolled in Linear Algebra"
console.log(alice.enroll(math));   // "Already enrolled in Linear Algebra"
console.log(bob.enroll(math));     // "Enrolled in Linear Algebra"

const charlie = new Student("S003", "Charlie");
console.log(charlie.enroll(math)); // "Course Linear Algebra is full"
console.log(math.isFull);          // true
console.log(math.availableSeats);  // 0

console.log(alice.enroll(python)); // "Enrolled in Python Basics"
console.log(alice.getCourseList()); // ["Linear Algebra", "Python Basics"]

*/

// =============================================================================
// 🟢 EXERCISE 03
// Domain: Personal Finance — Bank Account
// =============================================================================
/**
 * CONTEXT
 * -------
 * "CashTrack" is a personal finance app. Model a BankAccount class with full
 * transaction history tracking.
 *
 * BankAccount rules:
 *  - Properties: accountNumber (string), owner (string),
 *                private balance (number, starts at 0),
 *                private transactions: Array<{ type: string; amount: number; date: Date }>.
 *  - Method `deposit(amount: number): void`
 *      · Reject amounts ≤ 0 (throw Error: "Deposit amount must be positive").
 *      · Add to balance, push { type: "deposit", amount, date: new Date() }.
 *  - Method `withdraw(amount: number): void`
 *      · Reject amounts ≤ 0 (throw Error: "Withdrawal amount must be positive").
 *      · Reject if insufficient funds (throw Error: "Insufficient funds").
 *      · Subtract from balance, push { type: "withdrawal", amount, date: new Date() }.
 *  - Getter `currentBalance(): number`.
 *  - Method `getStatement(): string` — returns a formatted string listing all
 *    transactions:
 *      "=== Account Statement ===\n"
 *      + one line per transaction: "<type>  €<amount>  <ISO date string>\n"
 *      + "Balance: €<balance>"
 *
 * TASK
 * ----
 * Implement the BankAccount class from scratch following the rules above.
 * No blanks — write it all yourself.
 */

// → Write your implementation here
class BankAccount {
  public accountNumber: string;
  public owner: string;
  private balance: number;
  private transactions: Array<{ type: string; amount: number; date: Date }>;

  constructor(accountNumber: string, owner: string) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.balance = 0;
    this.transactions = [];
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount;
    this.transactions.push({ type: "deposit", amount, date: new Date() });
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    } else if (this.balance <= 0) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    this.transactions.push({ type: "withdrawal", amount, date: new Date() });
  }

  currentBalance(): number {
    return this.balance;
  }

  getStatement(): string {
    let statement = "=== Account Statement ===\n";

    for (let transaction of this.transactions) {
      statement += `${transaction.type}  €${transaction.amount}  ${transaction.date.toISOString()}\n`;
    }

    statement += `Balance: €${this.balance}`;
    return statement;
  }
}

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 03
 * ------------------------------------------------------------------

const acc = new BankAccount("FR7600001", "Alice Martin");

acc.deposit(1000);
acc.deposit(500);
acc.withdraw(200);

console.log(acc.currentBalance); // 1300

try { acc.withdraw(5000); } catch (e) { console.log((e as Error).message); }
// "Insufficient funds"

try { acc.deposit(-50); } catch (e) { console.log((e as Error).message); }
// "Deposit amount must be positive"

console.log(acc.getStatement());
// === Account Statement ===
// deposit     €1000  <date>
// deposit     €500   <date>
// withdrawal  €200   <date>
// Balance: €1300



// =============================================================================
// 🟡 EXERCISE 04 —(
// Domain: Marketplace — Seller + Product Catalog with Inheritance
// =============================================================================
/**
 * CONTEXT
 * -------
 * ShopHub now needs to model different kinds of sellers:
 *
 *   BaseSeller  (base class)
 *     - Properties: sellerId (string), storeName (string),
 *                   protected products: Product[] (reuse from Ex 01).
 *     - Method `addProduct(p: Product): void`.
 *     - Method `removeProduct(id: number): boolean` — returns true if found & removed.
 *     - Method `getInventoryValue(): number` — sum of (finalPrice * stock) for all products.
 *     - Method `describe(): string` — "[Seller] <storeName> — <N> products"
 *
 *   PremiumSeller extends BaseSeller
 *     - Extra property: commissionRate (number, e.g. 0.05 = 5%).
 *     - Override `getInventoryValue()` — deduct commission from each product's value.
 *     - Override `describe()` — "[Premium Seller] <storeName> — <N> products (commission: <rate*100>%)"
 *     - Method `applyBulkDiscount(rate: number): void`
 *       calls applyDiscount(rate) on every product in inventory.
 *
 *   VerifiedSeller extends PremiumSeller
 *     - Extra property: verifiedSince (Date).
 *     - Override `describe()` — adds " ✓ Verified since <YYYY>" at the end.
 *     - Method `getVerificationAge(): number` — years since verifiedSince.
 *
 * TASK
 * ----
 * Implement the three classes. Use the Product class from Exercise 01.
 */

// → Write your implementation here

class BaseSeller {
  public sellerId: string;
  public storeName: string;
  protected products: Product[];

  constructor(sellerId: string, storeName: string) {
    this.sellerId = sellerId;
    this.storeName = storeName;
    this.products = [];
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  removeProduct(id: number): boolean {
    return this.products.splice(id, 1);
  }

  getInventoryValue(): number {
    let total = 0;

    for (const product of this.products) {
      total += product.finalPrice * product.stock;
    }
    return total;
  }

  describe(): string {
    return `[Seller] ${this.storeName} — ${this.products.length} products`;
  }
}

class PremiumSeller extends BaseSeller {
  public commissionRate: number;

  constructor(sellerId: string, storeName: string, commissionRate: number) {
    super(sellerId, storeName);
    this.commissionRate = commissionRate;
  }

  override getInventoryValue(): number {
    return super.getInventoryValue() * (1 - this.commissionRate);
  }

  override describe(): string {
    return `[Premium Seller] ${this.storeName} — ${this.products.length} products (commission: ${this.commissionRate * 100}%)`;
  }

  applyBulkDiscount(rate: number): void {
    for (const product of this.products) {
      product.applyDiscount(rate);
    }
  }
}

class VerifiedSeller extends PremiumSeller {
  public verifiedSince: Date;

  constructor(
    sellerId: string,
    storeName: string,
    commissionRate: number,
    verifiedSince: Date,
  ) {
    super(sellerId, storeName, commissionRate);
    this.verifiedSince = verifiedSince;
  }

  override describe(): string {
    return `[Verified Seller] ${this.storeName} — ${this.products.length} products (commission: ${this.commissionRate * 100}%) ✓ Verified since ${this.verifiedSince.getFullYear()}`;
  }

  getVerificationAge(): number {
    return new Date().getFullYear() - this.verifiedSince.getFullYear();
  }
}

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 04
 * ------------------------------------------------------------------

const kb  = new Product(1, "Keyboard", 80, 10);
const mon = new Product(2, "Monitor",  300, 5);
const hd  = new Product(3, "Hard Drive", 60, 20);

const vs = new VerifiedSeller("S001", "TechStore", 0.08, new Date("2019-03-15"));
vs.addProduct(kb);
vs.addProduct(mon);
vs.addProduct(hd);

console.log(vs.describe());
// [Premium Seller] TechStore — 3 products (commission: 8%) ✓ Verified since 2019

console.log(vs.getInventoryValue().toFixed(2));
// (80*10 + 300*5 + 60*20) * (1 - 0.08) = (800+1500+1200)*0.92 = 3220

vs.applyBulkDiscount(0.1);
console.log(kb.finalPrice); // 72
console.log(mon.finalPrice); // 270

console.log(vs.removeProduct(2)); // true
console.log(vs.removeProduct(99));// false
console.log(vs.describe());       // 2 products now

console.log(vs.getVerificationAge()); // ~6 (depends on current year)

*/

// =============================================================================
// 🟡 EXERCISE 05
// Domain: FinTech — Portfolio Tracker with Interfaces
// =============================================================================
/**
 * CONTEXT
 * -------
 * "WealthBoard" is a FinTech dashboard. You need to model financial assets
 * using TypeScript interfaces and implementing classes.
 *
 * Define the following interfaces:
 *
 *   IAsset
 *     - symbol: string
 *     - currentPrice: number
 *     - getValue(): number          // current market value
 *     - getSummary(): string
 *
 *   IPriceable
 *     - updatePrice(newPrice: number): void
 *     - priceHistory: number[]
 *
 *   ITradeable extends IAsset, IPriceable
 *     - buy(quantity: number): void
 *     - sell(quantity: number): void
 *     - quantity: number
 *
 * Implement:
 *
 *   Stock implements ITradeable
 *     - Properties: symbol, currentPrice, quantity, priceHistory, companyName.
 *     - buy / sell update quantity (sell throws if insufficient).
 *     - updatePrice appends to priceHistory and updates currentPrice.
 *     - getValue() = currentPrice * quantity.
 *     - getSummary() = "<symbol> (<companyName>) — qty: <qty> @ €<price> = €<value>"
 *
 *   Bond implements IAsset
 *     - Properties: symbol, currentPrice, faceValue (number), couponRate (number),
 *                   maturityDate (Date).
 *     - getValue() = faceValue (bonds return face value at maturity).
 *     - getSummary() = "<symbol> Bond — face: €<faceValue>, coupon: <couponRate*100>%, matures: <YYYY-MM-DD>"
 *
 *   Portfolio
 *     - private assets: Map<string, IAsset>  (key = symbol)
 *     - addAsset(asset: IAsset): void
 *     - removeAsset(symbol: string): boolean
 *     - getTotalValue(): number
 *     - getAsset(symbol: string): IAsset | undefined
 *     - printReport(): void — logs each asset's getSummary() + total value
 *
 * TASK
 * ----
 * Implement all interfaces and classes above.
 */

// → Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 05
 * ------------------------------------------------------------------

const apple = new Stock("AAPL", 185, 10, "Apple Inc.");
const tesla = new Stock("TSLA", 240, 5,  "Tesla Inc.");
const bond  = new Bond("FR0001", 1000, 1000, 0.035, new Date("2028-06-01"));

apple.buy(5);
console.log(apple.quantity);    // 15
apple.updatePrice(190);
console.log(apple.priceHistory); // [185, 190]
console.log(apple.getValue());   // 2850

tesla.sell(2);
console.log(tesla.quantity);   // 3
try { tesla.sell(10); } catch(e) { console.log((e as Error).message); }
// "Insufficient quantity"

const portfolio = new Portfolio();
portfolio.addAsset(apple);
portfolio.addAsset(tesla);
portfolio.addAsset(bond);

console.log(portfolio.getTotalValue()); // 2850 + 720 + 1000 = 4570
portfolio.printReport();
// AAPL (Apple Inc.) — qty: 15 @ €190 = €2850
// TSLA (Tesla Inc.) — qty: 3  @ €240 = €720
// FR0001 Bond — face: €1000, coupon: 3.5%, matures: 2028-06-01
// Total Portfolio Value: €4570

portfolio.removeAsset("TSLA");
console.log(portfolio.getTotalValue()); // 3850

*/

// =============================================================================
// 🟡 EXERCISE 06
// Domain: Learning Platform — Quiz Engine with Map & Set
// =============================================================================
/**
 * CONTEXT
 * -------
 * LearnFlow needs a quiz engine. Build the following:
 *
 *   Question
 *     - id: number, prompt: string, correctAnswer: string,
 *       private wrongAttempts: number (starts 0)
 *     - check(answer: string): boolean — case-insensitive comparison;
 *       increments wrongAttempts on failure.
 *     - get difficulty(): "easy" | "medium" | "hard"
 *       (0 wrong = "easy", 1–2 = "medium", 3+ = "hard")
 *
 *   QuizSession
 *     - sessionId: string
 *     - private questions: Map<number, Question>  (id → Question)
 *     - private answeredIds: Set<number>           (ids already answered)
 *     - private score: number (starts 0)
 *     - addQuestion(q: Question): void
 *     - answer(questionId: number, attempt: string): "correct" | "wrong" | "already answered" | "not found"
 *       · "already answered" if id in answeredIds
 *       · calls q.check(); if correct → score++ and add to answeredIds
 *       · if wrong → do NOT add to answeredIds (can retry)
 *     - getScore(): string  →  "<score>/<total questions>"
 *     - getRemainingQuestions(): Question[]  — questions NOT yet answered
 *     - getReport(): string  — for each question: "<prompt> → <difficulty>"
 *
 * TASK
 * ----
 * Implement Question and QuizSession.
 */

// → Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 06
 * ------------------------------------------------------------------

const q1 = new Question(1, "What is 2 + 2?", "4");
const q2 = new Question(2, "Capital of France?", "Paris");
const q3 = new Question(3, "What is typeof null?", "object");

const session = new QuizSession("QZ001");
session.addQuestion(q1);
session.addQuestion(q2);
session.addQuestion(q3);

console.log(session.answer(1, "5"));      // "wrong"
console.log(session.answer(1, "3"));      // "wrong"
console.log(session.answer(1, "4"));      // "correct"
console.log(session.answer(1, "4"));      // "already answered"
console.log(q1.difficulty);              // "medium" (2 wrong before correct)

console.log(session.answer(2, "paris"));  // "correct" (case insensitive)
console.log(session.answer(99, "x"));     // "not found"

console.log(session.getScore());          // "2/3"
console.log(session.getRemainingQuestions().map(q => q.id)); // [3]

console.log(session.getReport());
// What is 2 + 2? → medium
// Capital of France? → easy
// What is typeof null? → easy

*/

// =============================================================================
// 🔴 EXERCISE 07
// Domain: Marketplace — Order Management with Advanced Interfaces & Types
// =============================================================================
/**
 * CONTEXT
 * -------
 * ShopHub needs a full order management system. Implement the following:
 *
 * TYPES & INTERFACES
 * ------------------
 *   type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"
 *
 *   type OrderItem = { product: Product; quantity: number; unitPrice: number }
 *
 *   interface ITimestamped
 *     - createdAt: Date
 *     - updatedAt: Date
 *     - touch(): void   // sets updatedAt to now
 *
 *   interface IStatusMachine<T>
 *     - status: T
 *     - transition(next: T): void   // must validate allowed transitions
 *     - getHistory(): T[]
 *
 *   interface IOrder extends ITimestamped, IStatusMachine<OrderStatus>
 *     - orderId: string
 *     - customerId: string
 *     - items: OrderItem[]
 *     - addItem(product: Product, qty: number): void
 *     - removeItem(productId: number): boolean
 *     - getTotal(): number
 *     - getInvoice(): string
 *
 * CLASSES
 * -------
 *   Order implements IOrder
 *     - Allowed transitions (throw if violated):
 *         pending → paid | cancelled
 *         paid    → shipped | cancelled
 *         shipped → delivered
 *         delivered, cancelled → (terminal — no further transitions)
 *     - addItem: uses product.finalPrice as unitPrice; reject if stock insufficient.
 *     - removeItem: restore product stock.
 *     - getTotal(): sum of unitPrice * quantity for all items.
 *     - getInvoice(): a nicely formatted multi-line string invoice.
 *
 *   OrderRepository
 *     - private orders: Map<string, Order>
 *     - save(order: Order): void
 *     - findById(id: string): Order | undefined
 *     - findByCustomer(customerId: string): Order[]
 *     - findByStatus(status: OrderStatus): Order[]
 *     - getRevenueByStatus(status: OrderStatus): number  // sum of totals
 *
 * TASK
 * ----
 * Implement all types, interfaces, and classes above.
 */

// → Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 07
 * ------------------------------------------------------------------

const kbd  = new Product(1, "Keyboard", 80, 5);
const mse  = new Product(2, "Mouse", 40, 10);

const order = new Order("ORD-001", "CUST-42");
order.addItem(kbd, 2);
order.addItem(mse, 3);
console.log(order.getTotal()); // 2*80 + 3*40 = 280
console.log(kbd.stock);        // 3

order.removeItem(2);
console.log(order.getTotal()); // 160
console.log(mse.stock);        // 10 (restored)

order.transition("paid");
order.transition("shipped");
try { order.transition("paid"); } catch(e) { console.log((e as Error).message); }
// "Invalid transition: shipped → paid"

order.transition("delivered");
console.log(order.status);    // "delivered"
console.log(order.getHistory()); // ["pending","paid","shipped","delivered"]

const repo = new OrderRepository();
repo.save(order);

const order2 = new Order("ORD-002", "CUST-42");
order2.addItem(kbd, 1);
order2.transition("paid");
order2.transition("cancelled");
repo.save(order2);

console.log(repo.findByCustomer("CUST-42").length); // 2
console.log(repo.findByStatus("delivered").length);  // 1
console.log(repo.getRevenueByStatus("delivered"));   // 160

console.log(order.getInvoice());
// === INVOICE ORD-001 ===
// Date: <date>
// Customer: CUST-42
// ─────────────────────
// Keyboard   x2   €80.00   €160.00
// ─────────────────────
// TOTAL: €160.00
// Status: delivered

*/

// =============================================================================
// 🔴 EXERCISE 08
// Domain: EdTech — Notification System with Advanced Interface Composition
// =============================================================================
/**
 * CONTEXT
 * -------
 * LearnFlow needs a multi-channel notification system.
 *
 * INTERFACES
 * ----------
 *   interface ISerializable
 *     - serialize(): string           // JSON string
 *     - static deserialize(raw: string): unknown   // (implement as static method on classes)
 *
 *   interface IDeliverable
 *     - channel: "email" | "sms" | "push"
 *     - recipient: string
 *     - deliver(): Promise<boolean>   // simulates async send (resolves after 100ms, 90% success)
 *     - retries: number               // max retry attempts
 *
 *   interface INotification extends ISerializable, IDeliverable
 *     - notificationId: string
 *     - subject: string
 *     - body: string
 *     - sentAt: Date | null
 *     - status: "pending" | "sent" | "failed"
 *
 *   interface INotificationQueue
 *     - enqueue(n: INotification): void
 *     - processAll(): Promise<{ sent: number; failed: number }>
 *     - getPending(): INotification[]
 *
 * CLASSES
 * -------
 *   BaseNotification implements INotification
 *     - Abstract-like base (do not mark abstract — use protected helper methods).
 *     - deliver(): tries up to `retries` times with 100ms delay between attempts;
 *       on success sets status "sent" and sentAt = now; on final failure → "failed".
 *
 *   EmailNotification extends BaseNotification
 *     - channel = "email"
 *     - Extra: ccList: string[]
 *     - serialize() includes ccList.
 *
 *   SMSNotification extends BaseNotification
 *     - channel = "sms"
 *     - Extra: phoneNumber: string (same as recipient but explicit)
 *
 *   NotificationQueue implements INotificationQueue
 *     - private queue: INotification[]
 *     - processAll() processes sequentially, respects retries, collects results.
 *
 * TASK
 * ----
 * Implement all interfaces and classes. Simulate the async send with:
 *   Math.random() > 0.1  (90% success rate per attempt)
 */

// → Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 08
 * ------------------------------------------------------------------

async function runEx09() {
  const queue = new NotificationQueue();

  const email = new EmailNotification(
    "N001", "Welcome to LearnFlow!", "Hi Alice, your account is ready.",
    "alice@example.com", ["support@learnflow.io"], 3
  );

  const sms = new SMSNotification(
    "N002", "Verification Code", "Your code is 4821",
    "+33612345678", 2
  );

  queue.enqueue(email);
  queue.enqueue(sms);

  console.log(queue.getPending().length); // 2

  const result = await queue.processAll();
  console.log(result); // { sent: N, failed: M }  (probabilistic)

  console.log(email.status);   // "sent" or "failed"
  console.log(email.sentAt);   // Date or null
  console.log(email.serialize());
  // { "notificationId":"N001","subject":"Welcome to LearnFlow!", ... }

  console.log(queue.getPending().length); // 0
}

runEx09();

*/

// =============================================================================
// ⚫ EXERCISE 10
// Domain: Full Marketplace — Real-time Auction System
// =============================================================================
/**
 * CONTEXT
 * -------
 * ShopHub is launching a live auction feature. Design and implement a full
 * auction system from scratch using all OOP concepts covered so far.
 *
 * REQUIREMENTS
 * ------------
 *
 * TYPES
 *   type AuctionStatus = "scheduled" | "live" | "ended" | "cancelled"
 *   type BidResult    = { success: boolean; message: string; currentBid: number }
 *   type Tuple usage  : represent a bid entry as [bidderId: string, amount: number, timestamp: Date]
 *
 * INTERFACES
 *   IAuctionItem
 *     - itemId: string
 *     - title: string
 *     - description: string
 *     - startingPrice: number
 *     - reservePrice: number        // minimum to actually sell
 *     - isReserveMet(): boolean
 *
 *   IAuction extends ITimestamped, IStatusMachine<AuctionStatus>
 *     (reuse interfaces from Ex 07)
 *     - auctionId: string
 *     - item: IAuctionItem
 *     - scheduledStart: Date
 *     - scheduledEnd: Date
 *     - start(): void
 *     - end(): void
 *     - cancel(reason: string): void
 *     - placeBid(bidderId: string, amount: number): BidResult
 *     - getWinner(): { bidderId: string; amount: number } | null
 *     - getBidHistory(): Array<[string, number, Date]>   // tuple usage
 *
 *   IObserver<T>
 *     - update(event: T): void
 *
 *   IObservable<T>
 *     - subscribe(observer: IObserver<T>): void
 *     - unsubscribe(observer: IObserver<T>): void
 *     - notify(event: T): void
 *
 * CLASSES
 *   AuctionItem implements IAuctionItem
 *
 *   Auction implements IAuction, IObservable<{ type: string; payload: unknown }>
 *     - Allowed transitions: scheduled→live, live→ended|cancelled, (ended,cancelled) terminal
 *     - placeBid only works when live.
 *     - Bid must be strictly greater than current highest bid (or startingPrice if none).
 *     - Notifies all observers on: bid placed, auction started, auction ended.
 *     - winner is highest bidder only if reservePrice is met.
 *
 *   BidderLogger implements IObserver<...>
 *     - Logs every event to an internal array: getLog(): string[]
 *
 *   AuctionHouse
 *     - private auctions: Map<string, Auction>
 *     - private globalLogger: BidderLogger (auto-subscribed to every auction)
 *     - createAuction(id, item, start, end): Auction
 *     - getAuction(id): Auction | undefined
 *     - getLiveAuctions(): Auction[]
 *     - getTotalRevenue(): number    // sum of winning bids for ended auctions where reserve was met
 *     - getFullLog(): string[]
 *
 * EDGE CASES TO HANDLE
 *   - Bid below current highest → reject
 *   - Bid when not live → reject
 *   - Ending auction below reserve → winner = null (not sold)
 *   - Cancelling after already ended → throw
 *   - Self-outbidding: same bidder can place higher bid
 *   - Multiple concurrent bidders (simulate with sequential calls)
 *
 * TASK
 * ----
 * Implement everything from scratch. This exercise combines ALL topics.
 */

// → Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO — Exercise 10
 * ------------------------------------------------------------------

const item = new AuctionItem("ITEM-001", "Vintage Rolex", "1965 Submariner, mint condition", 5000, 8000);

const now   = new Date();
const start = new Date(now.getTime() + 100);  // starts in 100ms
const end   = new Date(now.getTime() + 5000); // ends in 5s

const house   = new AuctionHouse();
const auction = house.createAuction("AUC-001", item, start, end);

const logger = new BidderLogger();
auction.subscribe(logger);

// Cannot bid before start
console.log(auction.placeBid("alice", 5500).success); // false

// Start auction
auction.start();
console.log(auction.status); // "live"

// Valid bids
console.log(auction.placeBid("alice", 5500)); // { success: true, message: "Bid accepted", currentBid: 5500 }
console.log(auction.placeBid("bob",   5500)); // { success: false, message: "Bid must exceed current highest bid", ... }
console.log(auction.placeBid("bob",   6000)); // { success: true, ... }
console.log(auction.placeBid("alice", 7000)); // { success: true, ... }
console.log(auction.placeBid("alice", 9000)); // { success: true, ... } — reserve met!

item.isReserveMet();  // check inside auction logic

auction.end();
console.log(auction.status);    // "ended"
console.log(auction.getWinner()); // { bidderId: "alice", amount: 9000 }

console.log(auction.getBidHistory().length); // 4 successful bids
console.log(house.getTotalRevenue());        // 9000

console.log(logger.getLog());
// ["Auction AUC-001 started", "Bid placed: alice €5500", "Bid placed: bob €6000", ...]

// Reserve not met scenario
const cheapItem    = new AuctionItem("ITEM-002", "Old Lamp", "Dusty lamp", 10, 200);
const cheapAuction = house.createAuction("AUC-002", cheapItem, now, end);
cheapAuction.start();
cheapAuction.placeBid("carol", 50);
cheapAuction.end();
console.log(cheapAuction.getWinner()); // null (reserve not met)
console.log(house.getTotalRevenue());  // still 9000

try {
  auction.transition("live");
} catch(e) { console.log((e as Error).message); } // "Invalid transition: ended → live"

console.log(house.getFullLog().length); // all events from all auctions

*/

// =============================================================================
// 💥 MEGA PROBLEM — Multi-Domain Platform: "NexusHub"
// Covers ALL Chapter 3 Part 1 topics
// =============================================================================
/**
 * ============================================================================
 * CONTEXT — NexusHub: The All-In-One Platform
 * ============================================================================
 *
 * NexusHub is an ambitious platform combining three verticals:
 *   1. 🛒 Marketplace  — products, sellers, orders
 *   2. 📈 FinTech      — user wallets, payments, risk checks
 *   3. 🎓 Learning     — courses, enrollments, certifications
 *
 * Users are central: a User can be a Buyer, a Seller, a Learner, or any
 * combination. The platform must manage everything in a unified system.
 *
 * ============================================================================
 * WHAT TO BUILD (implement each section in order)
 * ============================================================================
 *
 * ── SECTION A: Identity & Roles ─────────────────────────────────────────────
 *
 *   type Role = "buyer" | "seller" | "learner" | "admin"
 *
 *   interface IIdentifiable
 *     - id: string
 *     - createdAt: Date
 *
 *   interface IRoleHolder
 *     - roles: Set<Role>
 *     - hasRole(role: Role): boolean
 *     - addRole(role: Role): void
 *
 *   class User implements IIdentifiable, IRoleHolder
 *     - Properties: id, email, displayName, createdAt, roles (starts empty Set).
 *     - Method `getProfile(): string`  →  "<displayName> (<email>) [<roles joined by ','>]"
 *
 *   class AdminUser extends User
 *     - constructor auto-adds "admin" role.
 *     - Extra: permissions: Set<string>
 *     - addPermission(p: string): void
 *     - hasPermission(p: string): boolean
 *
 * ── SECTION B: Wallet & Payments ────────────────────────────────────────────
 *
 *   type TransactionType = "credit" | "debit" | "refund" | "fee"
 *
 *   type WalletTransaction = {
 *     txId: string;
 *     type: TransactionType;
 *     amount: number;
 *     description: string;
 *     timestamp: Date;
 *   }
 *
 *   interface IWallet
 *     - owner: User
 *     - balance: number (readonly getter)
 *     - credit(amount: number, description: string): WalletTransaction
 *     - debit(amount: number, description: string): WalletTransaction   // throw if insufficient
 *     - getTransactions(): WalletTransaction[]
 *     - getTransactionsByType(type: TransactionType): WalletTransaction[]
 *
 *   class Wallet implements IWallet
 *     - Generate txId as "TX-<timestamp>-<random 4-digit>"
 *
 *   class PremiumWallet extends Wallet
 *     - cashbackRate: number (e.g. 0.02 = 2%)
 *     - Override credit(): auto-credits an additional cashback amount
 *       (type: "credit", description: "Cashback").
 *     - Method getCashbackEarned(): number  — sum of all cashback credits.
 *
 * ── SECTION C: Marketplace (reuse & extend) ──────────────────────────────────
 *
 *   Reuse Product from Ex 01.
 *
 *   class NexusSeller extends VerifiedSeller (from Ex 04)
 *     - Extra: wallet: Wallet
 *     - When a product is sold (via a NexusOrder), the seller's wallet is credited
 *       with the product's finalPrice * quantity, minus a platform fee of 5%.
 *
 *   type NexusOrderStatus = "cart" | "pending_payment" | "paid" | "shipped" | "delivered" | "refunded"
 *
 *   class NexusOrder
 *     - orderId, buyer (User), items (OrderItem[]), status, createdAt
 *     - addItem(product, qty): void  (same rules as Order in Ex 07)
 *     - checkout(wallet: Wallet): boolean
 *       · Transition status from "cart" → "pending_payment"
 *       · Debits total from wallet
 *       · On success → "paid", credits each seller's wallet
 *       · On failure (insufficient funds) → stays "pending_payment", returns false
 *     - refund(wallet: Wallet): boolean
 *       · Only from "paid" or "shipped"
 *       · Credits buyer's wallet, debits sellers' wallets (or platform absorbs)
 *       · Status → "refunded"
 *     - getReceipt(): string
 *
 * ── SECTION D: Learning (reuse & extend) ────────────────────────────────────
 *
 *   Reuse Course from Ex 02.
 *
 *   interface ICertifiable
 *     - issue(user: User, course: Course): Certificate
 *     - validate(certId: string): boolean
 *
 *   class Certificate
 *     - certId: string, issuedTo: User, course: Course, issuedAt: Date, expiresAt: Date (1 year)
 *     - isValid(): boolean  — not expired
 *     - toString(): string  →  "CERT-<certId>: <displayName> completed <title> on <YYYY-MM-DD>"
 *
 *   class CertificationAuthority implements ICertifiable
 *     - private certs: Map<string, Certificate>
 *     - issue(user, course): Certificate  — certId = "CERT-<uuid-like>"
 *     - validate(certId): boolean
 *     - getCertsByUser(userId: string): Certificate[]
 *
 *   class NexusCourse extends Course
 *     - price: number (courses are paid on NexusHub)
 *     - instructor: NexusSeller
 *     - private completedStudents: Set<string>  (user ids)
 *     - purchase(user: User, wallet: Wallet): boolean
 *       · Debits wallet by course.price
 *       · Enrolls user in course
 *       · Credits instructor's wallet (minus 10% platform fee)
 *     - markComplete(userId: string): void
 *     - isCompleted(userId: string): boolean
 *
 * ── SECTION E: NexusHub Platform Orchestrator ────────────────────────────────
 *
 *   class NexusHub
 *     - private users:    Map<string, User>
 *     - private sellers:  Map<string, NexusSeller>
 *     - private courses:  Map<string, NexusCourse>
 *     - private orders:   Map<string, NexusOrder>
 *     - private certAuth: CertificationAuthority
 *     - private riskEngine: RiskEngine  (from Ex 08)
 *
 *     - registerUser(id, email, name): User
 *     - registerSeller(user: User, storeName: string, verifiedSince: Date): NexusSeller
 *     - createCourse(id, title, seats, price, instructor: NexusSeller): NexusCourse
 *     - createOrder(buyer: User): NexusOrder
 *
 *     - processCheckout(order: NexusOrder, wallet: Wallet): boolean
 *       · Runs risk analysis on a synthetic FinancialEvent before processing
 *       · Rejects if risk level is "critical"
 *       · Otherwise delegates to order.checkout()
 *
 *     - completeCourse(user: User, course: NexusCourse): Certificate | null
 *       · Only if isCompleted(user.id)
 *       · Issues certificate via certAuth
 *
 *     - getPlatformReport(): string
 *       · Total users, sellers, orders, revenue, certificates issued
 *
 * ── SECTION F: Special Types & Utilities ────────────────────────────────────
 *
 *   - Write a generic function `findOrThrow<T>(map: Map<string, T>, key: string, label: string): T`
 *     that retrieves from a Map or throws `Error("<label> '<key>' not found")`.
 *
 *   - Write a type-safe `parseUnknown(data: unknown): { id: string; amount: number } | null`
 *     that validates and extracts id (string) and amount (number) from an unknown payload.
 *
 *   - Write `exhaustiveCheck(x: never): never` used in switch statements over
 *     discriminated unions (reuse / refine from Ex 08).
 *
 * ============================================================================
 * TASK
 * ============================================================================
 * Implement ALL sections A through F in order. Each section builds on the
 * previous ones. Take your time — this is a capstone problem.
 * ============================================================================
 */

// → Write your NexusHub implementation here

/* ------------------------------------------------------------------
 * FULL TEST SCENARIO — NexusHub Mega Problem
 * ------------------------------------------------------------------

async function runNexusHub() {
  const hub = new NexusHub();

  // ── Users & Roles ───────────────────────────────────────────────
  const alice = hub.registerUser("U001", "alice@nexus.io", "Alice Martin");
  const bob   = hub.registerUser("U002", "bob@nexus.io",   "Bob Chen");
  alice.addRole("buyer");
  alice.addRole("learner");
  bob.addRole("buyer");

  const admin = new AdminUser("A001", "admin@nexus.io", "NexusAdmin");
  admin.addPermission("ban_user");
  admin.addPermission("refund_order");
  console.log(admin.hasPermission("ban_user")); // true
  console.log(admin.hasRole("admin"));           // true
  console.log(alice.getProfile()); // "Alice Martin (alice@nexus.io) [buyer,learner]"

  // ── Wallets ─────────────────────────────────────────────────────
  const aliceWallet = new PremiumWallet(alice, 0.02);
  const bobWallet   = new Wallet(bob);
  aliceWallet.credit(2000, "Initial deposit");
  bobWallet.credit(500, "Initial deposit");

  console.log(aliceWallet.balance);       // 2040 (2000 + 2% cashback = 40)
  console.log(aliceWallet.getCashbackEarned()); // 40

  // ── Seller & Products ───────────────────────────────────────────
  const sellerUser = hub.registerUser("U003", "techstore@nexus.io", "TechStore");
  sellerUser.addRole("seller");
  const seller = hub.registerSeller(sellerUser, "TechStore Pro", new Date("2020-01-01"));

  const laptop = new Product(10, "Laptop Pro", 1200, 5);
  const mouse  = new Product(11, "Wireless Mouse", 45, 20);
  seller.addProduct(laptop);
  seller.addProduct(mouse);

  // ── Order & Checkout ────────────────────────────────────────────
  const order = hub.createOrder(alice);
  order.addItem(laptop, 1);
  order.addItem(mouse, 2);
  console.log(order.getReceipt()); // cart receipt: 1200 + 90 = 1290

  const checkoutResult = await hub.processCheckout(order, aliceWallet);
  console.log(checkoutResult);       // true (sufficient funds, low risk)
  console.log(order.status);         // "paid"
  console.log(aliceWallet.balance);  // 2040 - 1290 + cashback ≈ 776.8

  // Seller receives 95% of sale
  console.log(seller.wallet.balance); // (1200 + 90) * 0.95 = 1225.50

  // ── Courses & Certification ─────────────────────────────────────
  const tsCourse = hub.createCourse("CRS-001", "TypeScript Mastery", 30, 99, seller);

  const enrolled = tsCourse.purchase(alice, aliceWallet);
  console.log(enrolled); // true
  console.log(aliceWallet.balance); // reduced by 99

  tsCourse.markComplete(alice.id);
  console.log(tsCourse.isCompleted(alice.id)); // true

  const cert = hub.completeCourse(alice, tsCourse);
  console.log(cert?.toString());
  // CERT-...: Alice Martin completed TypeScript Mastery on <date>
  console.log(cert?.isValid()); // true

  // ── Risk Rejection ──────────────────────────────────────────────
  const suspiciousOrder = hub.createOrder(bob);
  suspiciousOrder.addItem(mouse, 1);
  // Simulate: large amount that triggers critical risk
  // (The hub internally creates the FinancialEvent; test via a mock large product)
  const expensiveItem = new Product(99, "Gold Server", 50_000, 1);
  const riskyOrder = hub.createOrder(bob);
  riskyOrder.addItem(expensiveItem, 1);
  const riskyResult = await hub.processCheckout(riskyOrder, bobWallet);
  console.log(riskyResult); // false (critical risk OR insufficient funds)

  // ── Utilities ───────────────────────────────────────────────────
  const userMap = new Map<string, User>([["U001", alice]]);
  console.log(findOrThrow(userMap, "U001", "User").displayName); // "Alice Martin"
  try { findOrThrow(userMap, "U999", "User"); } catch(e) { console.log((e as Error).message); }
  // "User 'U999' not found"

  const parsed = parseUnknown({ id: "abc", amount: 42 });
  console.log(parsed); // { id: "abc", amount: 42 }
  console.log(parseUnknown({ id: 123, amount: "oops" })); // null

  // ── Platform Report ─────────────────────────────────────────────
  console.log(hub.getPlatformReport());
  // === NexusHub Platform Report ===
  // Users: 4
  // Sellers: 1
  // Orders: 3
  // Revenue: €1225.50
  // Certificates Issued: 1
}

runNexusHub();

*/

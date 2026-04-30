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

// const product = new Product(1, 'iphone', 1200, 10) => this line exec the contructor
// product.finalPrice

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

  withdraw(amount: number): boolean {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    } else if (this.balance < amount) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
    this.transactions.push({ type: "withdrawal", amount, date: new Date() });
    return true;
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

// const bankAccount = new BankAccount('123456789', 'Bob');
// bankAccount.deposit(100);

// const transmationResult = bankAccount.withdraw(200);
// if (transmationResult === true)

// try {
// bankAccount.withdraw(200);
//} catch(e) {
// showAlert(e.message)
//}

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
    const product = this.products.find((p) => p.id === id);
    if (product) {
      this.products = this.products.filter((p) => p.id !== id);
      return true;
    } else {
      return false;
    }

    // return this.products.splice(id, 1);
    // @TODO
    // return false;
  }

  getInventoryValue(): number {
    return this.products.reduce((acc, curr) => acc + curr.finalPrice * curr.stock, 0);
    /** let total = 0;

    for (const product of this.products) {
      total += product.finalPrice * product.stock;
    }
    return total; **/
    // @TODO use reduce
  }

  describe(): string {
    return `[Seller] ${this.storeName} — ${this.products.length} products`;
  }
}

class PremiumSeller extends BaseSeller {
  public commissionRate: number;

  constructor(sellerId: string, storeName: string, commissionRate: number) {
    super(sellerId, storeName); // BaseSeller.contructor(sellerId, storeName)
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
interface IAsset {
  symbol: string;
  currentPrice: number;
  getValue(): number;
  getSummary(): string;
}

interface IPriceable {
  updatePrice(newPrice: number): void;
  priceHistory: number[];
}

interface ITradeable extends IAsset, IPriceable {
  buy(quantity: number): void;
  sell(quantity: number): void;
  quantity: number;
}

class Stock implements ITradeable {
  public symbol: string;
  public currentPrice: number;
  public quantity: number;
  public priceHistory: number[];
  public companyName: string;

  constructor(symbol: string, currentPrice: number, quantity: number, companyName: string) {
    this.symbol = symbol;
    this.currentPrice = currentPrice;
    this.quantity = quantity;
    this.priceHistory = [];
    this.companyName = companyName;
  }
  
  buy(quantity: number): void {
    this.quantity += quantity;
    this.priceHistory.push(this.currentPrice);
  }

  sell(quantity: number): void {
    if (quantity > this.quantity) {
      throw new Error("Insufficient quantity");
    }
    this.quantity -= quantity;
    this.priceHistory.push(this.currentPrice);
  }

  updatePrice(newPrice: number): void {
    this.currentPrice = newPrice;
    this.priceHistory.push(newPrice);
  }

  getValue(): number {
    return this.currentPrice * this.quantity;
  }
  
  getSummary(): string {
    return `${this.symbol} (${this.companyName}) — qty: ${this.quantity} @ €${this.currentPrice} = €${this.getValue()}`;
  }
}

class Bond implements IAsset {
  public symbol: string;
  public currentPrice: number;
  public faceValue: number;
  public couponRate: number;
  public maturityDate: Date;


  constructor(symbol: string, currentPrice: number, faceValue: number, couponRate: number, maturityDate: Date) {
    this.symbol = symbol;
    this.currentPrice = currentPrice;
    this.faceValue = faceValue;
    this.couponRate = couponRate;
    this.maturityDate = maturityDate;
  }
  
  getValue(): number {
    return this.faceValue;
  }

  getSummary(): string {
    return `${this.symbol} Bond — face: €${this.faceValue}, coupon: ${this.couponRate * 100}%, matures: ${this.maturityDate.toISOString()}`;
  }
}

class Portfolio {
  private assets: Map<string, IAsset>;

  constructor() {
    this.assets = new Map();
  }
// ?
  addAsset(asset: IAsset): void {
    this.assets.set(asset.symbol, asset);
  }

  removeAsset(symbol: string): boolean {
    return this.assets.delete(symbol);
  }
  
  // ?
  getTotalValue(): number {
    let total = 0;
    for (const asset of this.assets.values()) {
      total += asset.getValue();
    }
    return total;
  }

  getAsset(symbol: string): IAsset | undefined {
    return this.assets.get(symbol);
  }

  printReport(): void {
    for (const asset of this.assets.values()) {
      console.log(asset.getSummary());
    }
  }
}


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
type QuestionDifficulty = "easy" | "medium" | "hard";

interface IQuestion {
  id: number;
  prompt: string;
  correctAnswer: string;
  check(answer: string): boolean;
  readonly difficulty: QuestionDifficulty;
}

type QuizAnswerResult = "correct" | "wrong" | "already answered" | "not found";


class Question implements IQuestion {
  public id: number;
  public prompt: string;
  public correctAnswer: string;
  private wrongAttempts: number;


  constructor(id: number, prompt: string, correctAnswer: string) {
    this.id = id;
    this.prompt = prompt;
    this.correctAnswer = correctAnswer;
    this.wrongAttempts = 0;
  }
  
  check(answer: string): boolean {
    return answer.toLowerCase() === this.correctAnswer.toLowerCase();
  }

  get difficulty(): QuestionDifficulty {
    return this.wrongAttempts === 0 ? "easy" : this.wrongAttempts === 1 ? "medium" : "hard";
  }
}

class QuizSession {
  public sessionId: string;
  private questions: Map<number, Question>;
  private answeredIds: Set<number>;
  private score: number;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.questions = new Map();
    this.answeredIds = new Set();
    this.score = 0;
  }

  addQuestion(question: Question): void {
    this.questions.set(question.id, question);
  }

  answer(questionId: number, attempt: string): QuizAnswerResult {
    const question = this.questions.get(questionId);
    if (!question) {
      return "not found";
    }
    if (this.answeredIds.has(questionId)) return "already answered";
    if (question.check(attempt)) {
      this.score++;
      this.answeredIds.add(questionId);
      return "correct";
    }
    return "wrong";
  }
}

// QuizSession
// *     - sessionId: string
// *     - private questions: Map<number, Question>  (id → Question)
// *     - private answeredIds: Set<number>           (ids already answered)
// *     - private score: number (starts 0)
// *     - addQuestion(q: Question): void
// *     - answer(questionId: number, attempt: string): "correct" | "wrong" | "already answered" | "not found"
// *       · "already answered" if id in answeredIds
// *       · calls q.check(); if correct → score++ and add to answeredIds
// *       · if wrong → do NOT add to answeredIds (can retry)
// *     - getScore(): string  →  "<score>/<total questions>"
// *     - getRemainingQuestions(): Question[]  — questions NOT yet answered
// *     - getReport(): string  — for each question: "<prompt> → <difficulty>"

// Question
//  *     - id: number, prompt: string, correctAnswer: string,
//  *       private wrongAttempts: number (starts 0)
//  *     - check(answer: string): boolean — case-insensitive comparison;
//  *       increments wrongAttempts on failure.
//  *     - get difficulty(): "easy" | "medium" | "hard"
//  *       (0 wrong = "easy", 1–2 = "medium", 3+ = "hard")

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

// =============================================================================
// CHAPTER 3 - PART 2 | Advanced TypeScript OOP Exercises
// Topics: abstract classes, static attributes/methods, inheritance,
//         polymorphism, dependency inversion, and SOLID principles.
// =============================================================================

// =============================================================================
// EXERCISE 01 - Static Members
// Domain: SaaS - Account Identifier Generator
// =============================================================================
/**
 * CONTEXT
 * -------
 * "CloudDesk" needs a small utility class that creates unique account ids.
 *
 * REQUIREMENTS
 * ------------
 * Implement `AccountIdGenerator`.
 *
 * The class must:
 *  1. Have a private static counter starting at 1.
 *  2. Have a static readonly prefix = "ACC".
 *  3. Have a static method `next(): string`
 *     - returns "ACC-0001", "ACC-0002", etc.
 *     - increments the counter after every call.
 *  4. Have a static method `resetForTests(): void`
 *     - resets counter to 1.
 *  5. Prevent object creation with a private constructor.
 *
 * TASK
 * ----
 * Implement the class.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 01
 * ------------------------------------------------------------------

AccountIdGenerator.resetForTests();

console.log(AccountIdGenerator.next()); // "ACC-0001"
console.log(AccountIdGenerator.next()); // "ACC-0002"
console.log(AccountIdGenerator.next()); // "ACC-0003"

// const generator = new AccountIdGenerator(); // should be invalid

*/

// =============================================================================
// EXERCISE 02 - Abstract Class
// Domain: Payments - Payment Methods
// =============================================================================
/**
 * CONTEXT
 * -------
 * A checkout module needs multiple payment methods. Each method has common
 * validation, but each method processes payment differently.
 *
 * REQUIREMENTS
 * ------------
 * Implement:
 *
 *   abstract class PaymentMethod
 *     - constructor(public readonly label: string)
 *     - public pay(amount: number): string
 *       - throws Error("Amount must be positive") when amount <= 0
 *       - otherwise returns this.process(amount)
 *     - protected abstract process(amount: number): string
 *
 *   class CardPayment extends PaymentMethod
 *     - constructor(cardLast4: string)
 *     - process(amount) returns:
 *       "Paid EUR <amount> by card ****<last4>"
 *
 *   class WalletPayment extends PaymentMethod
 *     - constructor(walletId: string)
 *     - process(amount) returns:
 *       "Paid EUR <amount> from wallet <walletId>"
 *
 * TASK
 * ----
 * Implement all classes.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 02
 * ------------------------------------------------------------------

const card = new CardPayment("4242");
const wallet = new WalletPayment("WAL-001");

console.log(card.pay(100));   // "Paid EUR 100 by card ****4242"
console.log(wallet.pay(50));  // "Paid EUR 50 from wallet WAL-001"

try { card.pay(0); } catch (e) { console.log((e as Error).message); }
// "Amount must be positive"

*/

// =============================================================================
// EXERCISE 03 - Inheritance and Override
// Domain: HR - Employees and Managers
// =============================================================================
/**
 * CONTEXT
 * -------
 * A company needs to model employees. Managers are employees with a team.
 *
 * REQUIREMENTS
 * ------------
 * Implement:
 *
 *   class Employee
 *     - employeeId: string
 *     - fullName: string
 *     - baseSalary: number
 *     - constructor(employeeId, fullName, baseSalary)
 *     - getAnnualSalary(): number = baseSalary * 12
 *     - describe(): string = "[Employee] <fullName> - EUR <annualSalary>/year"
 *
 *   class Manager extends Employee
 *     - private teamMembers: Employee[] starts empty
 *     - bonusRate: number
 *     - addTeamMember(employee: Employee): void
 *     - getTeamSize(): number
 *     - override getAnnualSalary(): number
 *       base annual salary + bonusRate percentage
 *     - override describe(): string =
 *       "[Manager] <fullName> - team: <size> - EUR <annualSalary>/year"
 *
 * TASK
 * ----
 * Implement both classes.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 03
 * ------------------------------------------------------------------

const dev = new Employee("E001", "Alice Dev", 4000);
const manager = new Manager("M001", "Bob Lead", 6000, 0.15);

manager.addTeamMember(dev);

console.log(dev.getAnnualSalary());      // 48000
console.log(manager.getAnnualSalary());  // 82800
console.log(manager.getTeamSize());      // 1
console.log(manager.describe());
// "[Manager] Bob Lead - team: 1 - EUR 82800/year"

*/

// =============================================================================
// EXERCISE 04 - Polymorphism with Interfaces
// Domain: Logistics - Shipping Cost Calculator
// =============================================================================
/**
 * CONTEXT
 * -------
 * ShopHub supports multiple shipping strategies. Checkout code should not care
 * which shipping strategy is used.
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   type ShippingAddress = {
 *     country: string;
 *     city: string;
 *     postalCode: string;
 *   }
 *
 *   interface ShippingStrategy
 *     - name: string
 *     - calculate(weightKg: number, address: ShippingAddress): number
 *
 * Implement:
 *
 *   StandardShipping
 *     - name = "standard"
 *     - cost = 5 + weightKg * 1.2
 *
 *   ExpressShipping
 *     - name = "express"
 *     - cost = 12 + weightKg * 2.5
 *
 *   InternationalShipping
 *     - name = "international"
 *     - cost = 20 + weightKg * 4
 *     - if address.country === "France", use standard-like cost instead.
 *
 *   ShippingQuoteService
 *     - constructor(private readonly strategy: ShippingStrategy)
 *     - quote(weightKg, address): string
 *       returns "<strategy.name>: EUR <cost>"
 *
 * TASK
 * ----
 * Implement the type, interface, and classes.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 04
 * ------------------------------------------------------------------

const paris = { country: "France", city: "Paris", postalCode: "75001" };
const tokyo = { country: "Japan", city: "Tokyo", postalCode: "100-0001" };

const standardQuote = new ShippingQuoteService(new StandardShipping());
const expressQuote = new ShippingQuoteService(new ExpressShipping());
const internationalQuote = new ShippingQuoteService(new InternationalShipping());

console.log(standardQuote.quote(10, paris));       // "standard: EUR 17"
console.log(expressQuote.quote(10, paris));        // "express: EUR 37"
console.log(internationalQuote.quote(10, tokyo));  // "international: EUR 60"

*/

// =============================================================================
// EXERCISE 05 - Dependency Inversion
// Domain: Reporting - Export and Storage
// =============================================================================
/**
 * CONTEXT
 * -------
 * A reporting service must export reports. It should not depend directly on
 * local files, cloud storage, or email delivery.
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   interface ReportStorage
 *     - save(fileName: string, content: string): string
 *
 * Implement:
 *
 *   LocalReportStorage implements ReportStorage
 *     - save returns "Saved <fileName> locally"
 *
 *   CloudReportStorage implements ReportStorage
 *     - constructor(bucketName: string)
 *     - save returns "Saved <fileName> to bucket <bucketName>"
 *
 *   ReportService
 *     - constructor(private readonly storage: ReportStorage)
 *     - generateMonthlyReport(month: string, rows: string[]): string
 *       - creates fileName = "report-<month>.txt"
 *       - content is rows joined by "\n"
 *       - delegates saving to storage.save(fileName, content)
 *
 * TASK
 * ----
 * Implement all classes using dependency inversion.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 05
 * ------------------------------------------------------------------

const localReports = new ReportService(new LocalReportStorage());
console.log(localReports.generateMonthlyReport("2026-04", ["sales: 100", "refunds: 3"]));
// "Saved report-2026-04.txt locally"

const cloudReports = new ReportService(new CloudReportStorage("finance-prod"));
console.log(cloudReports.generateMonthlyReport("2026-04", ["sales: 100"]));
// "Saved report-2026-04.txt to bucket finance-prod"

*/

// =============================================================================
// EXERCISE 06 - SOLID Refactor
// Domain: E-commerce - Invoice Processing
// =============================================================================
/**
 * CONTEXT
 * -------
 * The current invoice code does too much in one class. Refactor the design using
 * SRP, OCP, and DIP.
 *
 * STARTING BAD DESIGN
 * -------------------
 *
 * class BadInvoiceProcessor {
 *   process(customerEmail: string, amount: number, type: "pdf" | "html") {
 *     if (!customerEmail.includes("@")) throw new Error("Invalid email");
 *     const content = type === "pdf" ? `PDF:${amount}` : `<html>${amount}</html>`;
 *     console.log("saving invoice");
 *     console.log(`email sent to ${customerEmail}: ${content}`);
 *   }
 * }
 *
 * REQUIREMENTS
 * ------------
 * Implement:
 *
 *   interface InvoiceFormatter
 *     - format(amount: number): string
 *
 *   PdfInvoiceFormatter
 *     - format returns "PDF invoice: EUR <amount>"
 *
 *   HtmlInvoiceFormatter
 *     - format returns "<h1>Invoice EUR <amount></h1>"
 *
 *   InvoiceValidator
 *     - validateEmail(email: string): void
 *
 *   InvoiceRepository
 *     - private invoices: string[]
 *     - save(content: string): void
 *     - getAll(): string[]
 *
 *   InvoiceEmailSender
 *     - send(email: string, content: string): string
 *
 *   InvoiceProcessor
 *     - constructor(validator, formatter, repository, emailSender)
 *     - process(email, amount): string
 *       validates, formats, saves, sends, then returns sender result.
 *
 * TASK
 * ----
 * Implement the refactored SOLID design.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 06
 * ------------------------------------------------------------------

const invoiceRepo = new InvoiceRepository();
const invoiceProcessor = new InvoiceProcessor(
  new InvoiceValidator(),
  new PdfInvoiceFormatter(),
  invoiceRepo,
  new InvoiceEmailSender()
);

console.log(invoiceProcessor.process("alice@example.com", 250));
// "Invoice email sent to alice@example.com"

console.log(invoiceRepo.getAll());
// ["PDF invoice: EUR 250"]

try { invoiceProcessor.process("bad-email", 100); }
catch (e) { console.log((e as Error).message); }
// "Invalid email"

*/

// =============================================================================
// EXERCISE 07 - Abstract Rules + Static Classification
// Domain: FinTech - Risk Rules
// =============================================================================
/**
 * CONTEXT
 * -------
 * A payment platform evaluates transactions with multiple risk rules.
 * Rules share common validation but each rule has its own scoring logic.
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   type RiskTransaction = {
 *     transactionId: string;
 *     userId: string;
 *     amount: number;
 *     country: string;
 *     hour: number; // 0-23
 *   }
 *
 *   type RiskLevel = "low" | "medium" | "high" | "critical"
 *
 * Implement:
 *
 *   abstract class RiskRule
 *     - static readonly maxScore = 100
 *     - constructor(public readonly code: string)
 *     - evaluate(tx): number
 *       - throws Error("Invalid transaction amount") when amount <= 0
 *       - returns this.score(tx), clamped between 0 and maxScore
 *     - protected abstract score(tx): number
 *
 *   LargeAmountRule extends RiskRule
 *     - score 0 below 1000, 30 below 5000, 70 below 20000, 100 otherwise
 *
 *   NightTransactionRule extends RiskRule
 *     - score 40 when hour is between 0 and 5, otherwise 0
 *
 *   ForeignCountryRule extends RiskRule
 *     - constructor(homeCountry: string)
 *     - score 35 when tx.country differs from homeCountry, otherwise 0
 *
 *   RiskEngine
 *     - private rules: RiskRule[]
 *     - static classify(score: number): RiskLevel
 *       0-29 low, 30-59 medium, 60-89 high, 90+ critical
 *     - addRule(rule): void
 *     - analyze(tx): { score: number; level: RiskLevel; details: string[] }
 *       details contains "<rule.code>: <score>"
 *
 * TASK
 * ----
 * Implement the risk engine.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 07
 * ------------------------------------------------------------------

const riskEngine = new RiskEngine();
riskEngine.addRule(new LargeAmountRule());
riskEngine.addRule(new NightTransactionRule());
riskEngine.addRule(new ForeignCountryRule("France"));

const riskResult = riskEngine.analyze({
  transactionId: "TX-1",
  userId: "U-1",
  amount: 7000,
  country: "Japan",
  hour: 2,
});

console.log(riskResult.level);   // "critical" (70 + 40 + 35 clamped to 100)
console.log(riskResult.score);   // 100
console.log(riskResult.details); // ["large_amount: 70", "night: 40", "foreign_country: 35"]

*/

// =============================================================================
// EXERCISE 08 - Polymorphic Import Pipeline
// Domain: Data Platform - File Importers
// =============================================================================
/**
 * CONTEXT
 * -------
 * A data platform imports users from different file formats. The import pipeline
 * should work with any importer that respects the same contract.
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   type ImportedUser = {
 *     id: string;
 *     email: string;
 *     name: string;
 *   }
 *
 *   interface UserImporter
 *     - sourceType: "csv" | "json" | "api"
 *     - import(raw: string): ImportedUser[]
 *
 * Implement:
 *
 *   CsvUserImporter
 *     - expects rows like "id,email,name"
 *     - ignores blank rows
 *
 *   JsonUserImporter
 *     - expects raw JSON array of ImportedUser
 *     - validates that parsed data is an array
 *
 *   ApiUserImporter
 *     - expects raw JSON with shape { data: ImportedUser[] }
 *
 *   UserImportPipeline
 *     - private importers: Map<string, UserImporter>
 *     - register(importer): void
 *     - run(sourceType, raw): ImportedUser[]
 *       - throws Error("Importer not found: <sourceType>") if missing
 *       - delegates to the selected importer
 *     - runMany(jobs: Array<{ sourceType: string; raw: string }>): ImportedUser[]
 *
 * TASK
 * ----
 * Implement the importers and pipeline.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 08
 * ------------------------------------------------------------------

const importPipeline = new UserImportPipeline();
importPipeline.register(new CsvUserImporter());
importPipeline.register(new JsonUserImporter());
importPipeline.register(new ApiUserImporter());

const csvUsers = importPipeline.run("csv", "U1,a@example.com,Alice\nU2,b@example.com,Bob");
console.log(csvUsers.length); // 2

const jsonUsers = importPipeline.run("json", JSON.stringify([
  { id: "U3", email: "c@example.com", name: "Chloe" }
]));
console.log(jsonUsers[0].name); // "Chloe"

const allImported = importPipeline.runMany([
  { sourceType: "csv", raw: "U4,d@example.com,Dan" },
  { sourceType: "api", raw: JSON.stringify({ data: [{ id: "U5", email: "e@example.com", name: "Eva" }] }) },
]);
console.log(allImported.map(u => u.id)); // ["U4", "U5"]

*/

// =============================================================================
// EXERCISE 09 - SOLID Permission System
// Domain: Admin Platform - Authorization
// =============================================================================
/**
 * CONTEXT
 * -------
 * An admin dashboard needs authorization rules. New rules must be added without
 * editing the authorization service.
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   type AdminAction = "read" | "create" | "refund" | "delete" | "ban"
 *
 *   type AdminContext = {
 *     userId: string;
 *     roles: string[];
 *     permissions: string[];
 *     resourceOwnerId?: string;
 *   }
 *
 *   interface AuthorizationRule
 *     - can(action: AdminAction, context: AdminContext): boolean
 *     - reason: string
 *
 * Implement:
 *
 *   RoleRule
 *     - allows everything when roles includes "super_admin"
 *
 *   PermissionRule
 *     - allows when permissions includes action
 *
 *   OwnershipRule
 *     - allows "read" and "delete" only when context.userId === context.resourceOwnerId
 *
 *   AuthorizationService
 *     - constructor(private readonly rules: AuthorizationRule[])
 *     - authorize(action, context): { allowed: boolean; reason: string }
 *       - allowed if at least one rule allows
 *       - reason is the successful rule reason, or "No rule allowed this action"
 *
 * SOLID EXPECTATIONS
 * ------------------
 * - OCP: adding a new rule should not require editing AuthorizationService.
 * - ISP: rules expose only the method the service needs.
 * - DIP: service depends on AuthorizationRule, not concrete classes.
 *
 * TASK
 * ----
 * Implement the rule system.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 09
 * ------------------------------------------------------------------

const auth = new AuthorizationService([
  new RoleRule(),
  new PermissionRule(),
  new OwnershipRule(),
]);

console.log(auth.authorize("ban", {
  userId: "A1",
  roles: ["super_admin"],
  permissions: [],
}).allowed); // true

console.log(auth.authorize("refund", {
  userId: "A2",
  roles: ["agent"],
  permissions: ["refund"],
}).reason); // "Permission allowed"

console.log(auth.authorize("delete", {
  userId: "U1",
  roles: ["user"],
  permissions: [],
  resourceOwnerId: "U1",
}).allowed); // true

*/

// =============================================================================
// EXERCISE 10 - Full Billing Engine
// Domain: SaaS - Subscription Billing
// =============================================================================
/**
 * CONTEXT
 * -------
 * CloudDesk needs a subscription billing engine. This exercise combines
 * abstract classes, static factories, inheritance, polymorphism, dependency
 * inversion, and SOLID.
 *
 * REQUIREMENTS
 * ------------
 * TYPES
 *   type BillingCycle = "monthly" | "yearly"
 *   type SubscriptionStatus = "trial" | "active" | "past_due" | "cancelled"
 *
 * INTERFACES
 *   interface PaymentGateway
 *     - charge(customerId: string, amount: number): Promise<string>
 *
 *   interface InvoiceStore
 *     - save(invoice: Invoice): void
 *     - findByCustomer(customerId: string): Invoice[]
 *
 * ABSTRACT CLASSES
 *   abstract class SubscriptionPlan
 *     - static readonly yearlyDiscountRate = 0.15
 *     - constructor(code: string, name: string, monthlyPrice: number)
 *     - getPrice(cycle: BillingCycle): number
 *       - monthly returns monthlyPrice
 *       - yearly returns monthlyPrice * 12 * (1 - yearlyDiscountRate)
 *     - abstract getFeatures(): string[]
 *
 * CONCRETE PLANS
 *   StarterPlan extends SubscriptionPlan
 *     - features: ["1 user", "basic support"]
 *
 *   ProPlan extends SubscriptionPlan
 *     - features: ["10 users", "priority support", "analytics"]
 *
 *   EnterprisePlan extends SubscriptionPlan
 *     - extra: dedicatedManager: string
 *     - features include dedicated manager
 *
 * OTHER CLASSES
 *   Invoice
 *     - static create(customerId, plan, cycle): Invoice
 *     - invoiceId = "INV-" + auto incremented number
 *     - amount = plan.getPrice(cycle)
 *     - paid = false by default
 *     - markPaid(paymentReference: string): void
 *
 *   Subscription
 *     - customerId, plan, cycle, status
 *     - changePlan(plan): void
 *     - cancel(): void
 *     - activate(): void
 *
 *   BillingService
 *     - constructor(gateway: PaymentGateway, invoiceStore: InvoiceStore)
 *     - bill(subscription): Promise<Invoice>
 *       - creates invoice
 *       - charges customer
 *       - marks invoice paid
 *       - saves invoice
 *       - activates subscription
 *       - if charge fails, status becomes "past_due"
 *
 *   FakePaymentGateway
 *     - constructor(shouldFail = false)
 *     - charge returns "PAY-<customerId>-<amount>" or throws Error("Payment failed")
 *
 *   InMemoryInvoiceStore
 *     - stores invoices in memory
 *
 * TASK
 * ----
 * Implement the full billing engine.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 10
 * ------------------------------------------------------------------

async function runBilling() {
  const store = new InMemoryInvoiceStore();
  const billing = new BillingService(new FakePaymentGateway(), store);

  const plan = new ProPlan("pro", "Pro", 49);
  const subscription = new Subscription("CUST-1", plan, "yearly", "trial");

  const invoice = await billing.bill(subscription);

  console.log(invoice.invoiceId); // "INV-1"
  console.log(invoice.paid);      // true
  console.log(subscription.status); // "active"
  console.log(store.findByCustomer("CUST-1").length); // 1

  const failingBilling = new BillingService(new FakePaymentGateway(true), store);
  const failedSubscription = new Subscription("CUST-2", new StarterPlan("starter", "Starter", 19), "monthly", "trial");

  try { await failingBilling.bill(failedSubscription); }
  catch (e) { console.log((e as Error).message); }
  // "Payment failed"

  console.log(failedSubscription.status); // "past_due"
}

runBilling();

*/

// =============================================================================
// MEGA PROBLEM - CityRide Fleet Dispatch Platform
// Covers ALL Chapter 3 Part 2 topics
// =============================================================================
/**
 * ============================================================================
 * CONTEXT - CityRide: Electric Taxi Fleet Dispatch
 * ============================================================================
 *
 * CityRide operates electric taxis across a large city. The platform must manage
 * vehicles, drivers, ride requests, pricing, dispatch, payment, notifications,
 * and reporting.
 *
 * The goal is to design a flexible OOP system where:
 * - shared behavior lives in abstract classes
 * - static factories generate stable ids and default objects
 * - vehicle, pricing, and notification behavior is polymorphic
 * - business services depend on interfaces, not concrete infrastructure
 * - SOLID principles are visible in the class design
 *
 * ============================================================================
 * WHAT TO BUILD
 * ============================================================================
 *
 * SECTION A - Core Types
 * ----------------------
 *   type VehicleStatus = "available" | "assigned" | "charging" | "maintenance"
 *   type RideStatus = "requested" | "assigned" | "in_progress" | "completed" | "cancelled"
 *
 *   type GeoPoint = {
 *     lat: number;
 *     lng: number;
 *   }
 *
 *   type RideRequest = {
 *     requestId: string;
 *     passengerId: string;
 *     pickup: GeoPoint;
 *     dropoff: GeoPoint;
 *     requestedAt: Date;
 *   }
 *
 * SECTION B - Static Utilities
 * ----------------------------
 *   class CityRideIdFactory
 *     - private static counters for vehicles, drivers, rides, and receipts
 *     - static nextVehicleId(): string -> "VEH-0001"
 *     - static nextDriverId(): string -> "DRV-0001"
 *     - static nextRideId(): string -> "RIDE-0001"
 *     - static nextReceiptId(): string -> "RCT-0001"
 *     - static resetForTests(): void
 *
 * SECTION C - Abstract Vehicle Model
 * ----------------------------------
 *   abstract class Vehicle
 *     - vehicleId: string
 *     - plateNumber: string
 *     - status: VehicleStatus starts "available"
 *     - batteryLevel: number, between 0 and 100
 *     - constructor(plateNumber: string, batteryLevel: number)
 *     - assign(): void
 *       throws Error("Vehicle is not available") unless status is "available"
 *     - release(): void sets status back to "available"
 *     - sendToCharge(): void sets status to "charging"
 *     - sendToMaintenance(): void sets status to "maintenance"
 *     - canAcceptRide(distanceKm: number): boolean
 *       false when not available, false when battery is too low
 *     - protected abstract getBatteryUsagePerKm(): number
 *     - abstract getCapacity(): number
 *
 *   class StandardCar extends Vehicle
 *     - battery usage: 1.5 per km
 *     - capacity: 4
 *
 *   class Van extends Vehicle
 *     - battery usage: 2.2 per km
 *     - capacity: 7
 *
 *   class LuxuryCar extends Vehicle
 *     - battery usage: 1.8 per km
 *     - capacity: 3
 *     - extra property: amenities: string[]
 *
 * SECTION D - Drivers and Pricing Polymorphism
 * --------------------------------------------
 *   class Driver
 *     - driverId: string
 *     - fullName: string
 *     - rating: number
 *     - assignedVehicle: Vehicle | null
 *     - assignVehicle(vehicle: Vehicle): void
 *     - unassignVehicle(): void
 *
 *   interface PricingStrategy
 *     - name: string
 *     - calculate(distanceKm: number, durationMinutes: number): number
 *
 *   Implement:
 *     - StandardPricing: 2.5 + distanceKm * 1.4 + durationMinutes * 0.2
 *     - SurgePricing: constructor(multiplier: number), applies multiplier to standard price
 *     - LuxuryPricing: 8 + distanceKm * 2.8 + durationMinutes * 0.4
 *
 * SECTION E - Ride Entity
 * -----------------------
 *   class Ride
 *     - rideId: string
 *     - request: RideRequest
 *     - driver: Driver | null
 *     - vehicle: Vehicle | null
 *     - status: RideStatus starts "requested"
 *     - distanceKm: number
 *     - durationMinutes: number
 *     - price: number starts 0
 *     - assign(driver: Driver, vehicle: Vehicle): void
 *       vehicle must accept the ride distance
 *       driver receives the vehicle
 *       vehicle status becomes "assigned"
 *       ride status becomes "assigned"
 *     - start(): void only from "assigned"
 *     - complete(pricing: PricingStrategy): number only from "in_progress"
 *       calculates price, releases vehicle, unassigns driver, status becomes "completed"
 *     - cancel(reason: string): void
 *       cannot cancel a completed ride
 *
 * SECTION F - Infrastructure Interfaces
 * -------------------------------------
 *   interface RideRepository
 *     - save(ride: Ride): void
 *     - findById(id: string): Ride | undefined
 *     - findByPassenger(passengerId: string): Ride[]
 *     - findCompleted(): Ride[]
 *
 *   interface PaymentGateway
 *     - charge(passengerId: string, amount: number): Promise<string>
 *
 *   interface NotificationSender
 *     - send(userId: string, message: string): Promise<void>
 *
 *   Implement in-memory or fake versions:
 *     - InMemoryRideRepository
 *     - FakePaymentGateway, constructor(shouldFail = false)
 *     - ConsoleNotificationSender
 *
 * SECTION G - Dispatch Service
 * ----------------------------
 *   class DispatchService
 *     - constructor(repository, paymentGateway, notificationSender, pricingStrategy)
 *     - private vehicles: Vehicle[]
 *     - private drivers: Driver[]
 *     - registerVehicle(vehicle): void
 *     - registerDriver(driver): void
 *     - requestRide(request, distanceKm, durationMinutes): Ride
 *       creates and saves a ride
 *     - dispatch(rideId): Promise<Ride>
 *       finds first available driver and first vehicle that can accept distance
 *       assigns ride
 *       sends notification to passenger
 *       saves ride
 *     - completeRide(rideId): Promise<string>
 *       starts ride if needed
 *       completes ride with pricing strategy
 *       charges passenger
 *       sends receipt notification
 *       saves ride
 *       returns payment reference
 *
 * SECTION H - Reporting
 * ---------------------
 *   class FleetReportService
 *     - constructor(repository: RideRepository)
 *     - getTotalRevenue(): number
 *     - getPassengerRideCount(passengerId: string): number
 *     - getCompletedRideSummary(): string[]
 *       each line: "<rideId> - <passengerId> - EUR <price>"
 *
 * SECTION I - SOLID CHECK
 * -----------------------
 * Your final design should demonstrate:
 *   - SRP: vehicles, pricing, rides, dispatch, payment, notifications, and reports are separate.
 *   - OCP: new vehicle types and pricing strategies do not require editing DispatchService.
 *   - LSP: every Vehicle subclass works anywhere a Vehicle is expected.
 *   - ISP: infrastructure interfaces are small and focused.
 *   - DIP: DispatchService depends on interfaces for repository, payment, and notification.
 *
 * TASK
 * ----
 * Implement CityRide from sections A through I.
 */

// -> Write your CityRide implementation here

/* ------------------------------------------------------------------
 * FULL TEST SCENARIO - MEGA PROBLEM
 * ------------------------------------------------------------------

async function runCityRide() {
  CityRideIdFactory.resetForTests();

  const repository = new InMemoryRideRepository();
  const paymentGateway = new FakePaymentGateway();
  const notifier = new ConsoleNotificationSender();

  const dispatch = new DispatchService(
    repository,
    paymentGateway,
    notifier,
    new StandardPricing()
  );

  const car = new StandardCar("AB-123-CD", 90);
  const van = new Van("VAN-777-ZZ", 80);
  const driver = new Driver("Alice Martin", 4.8);
  const secondDriver = new Driver("Bob Chen", 4.6);

  dispatch.registerVehicle(car);
  dispatch.registerVehicle(van);
  dispatch.registerDriver(driver);
  dispatch.registerDriver(secondDriver);

  const request: RideRequest = {
    requestId: "REQ-1",
    passengerId: "PASS-1",
    pickup: { lat: 48.8566, lng: 2.3522 },
    dropoff: { lat: 48.8738, lng: 2.295 },
    requestedAt: new Date(),
  };

  const ride = dispatch.requestRide(request, 8, 22);
  console.log(ride.status); // "requested"

  await dispatch.dispatch(ride.rideId);
  console.log(ride.status); // "assigned"
  console.log(car.status);  // "assigned"

  const paymentReference = await dispatch.completeRide(ride.rideId);
  console.log(paymentReference); // "PAY-PASS-1-<amount>"
  console.log(ride.status);      // "completed"
  console.log(car.status);       // "available"
  console.log(ride.price);        // standard price for 8km and 22 minutes

  const report = new FleetReportService(repository);
  console.log(report.getTotalRevenue()); // same as ride.price
  console.log(report.getPassengerRideCount("PASS-1")); // 1
  console.log(report.getCompletedRideSummary());
  // ["RIDE-0001 - PASS-1 - EUR <price>"]

  const luxuryDispatch = new DispatchService(
    repository,
    paymentGateway,
    notifier,
    new LuxuryPricing()
  );

  const luxuryCar = new LuxuryCar("LUX-001-AA", 100, ["water", "wifi", "quiet mode"]);
  const luxuryDriver = new Driver("Chloe Driver", 4.95);
  luxuryDispatch.registerVehicle(luxuryCar);
  luxuryDispatch.registerDriver(luxuryDriver);

  const luxuryRide = luxuryDispatch.requestRide(
    { ...request, requestId: "REQ-2", passengerId: "PASS-2" },
    12,
    30
  );

  await luxuryDispatch.dispatch(luxuryRide.rideId);
  await luxuryDispatch.completeRide(luxuryRide.rideId);
  console.log(luxuryRide.price); // luxury pricing

  const failingDispatch = new DispatchService(
    repository,
    new FakePaymentGateway(true),
    notifier,
    new SurgePricing(2)
  );

  failingDispatch.registerVehicle(new StandardCar("FAIL-001", 100));
  failingDispatch.registerDriver(new Driver("Failed Payment Driver", 4.2));

  const failedRide = failingDispatch.requestRide(
    { ...request, requestId: "REQ-3", passengerId: "PASS-3" },
    4,
    10
  );

  await failingDispatch.dispatch(failedRide.rideId);

  try { await failingDispatch.completeRide(failedRide.rideId); }
  catch (e) { console.log((e as Error).message); }
  // "Payment failed"
}

runCityRide();

*/

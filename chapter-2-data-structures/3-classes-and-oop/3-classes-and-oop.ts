/**
 * Practice Set: Classes and OOP (SOLID + Polymorphism)
 * Complete TODOs with production-oriented implementations.
 * - 10 feature-driven exercises
 * - 2 larger design problems
 */

/**
 * EXERCISE 1
 * SessionCounter class for auth dashboard.
 * - startSession(userId)
 * - endSession(userId)
 * - activeCount()
 * Use Set internally.
 */
export class SessionCounter {
  private readonly activeUsers = new Set<string>();

  startSession(userId: string): void {
    // TODO
    throw new Error("TODO");
  }

  endSession(userId: string): void {
    // TODO
    throw new Error("TODO");
  }

  activeCount(): number {
    // TODO
    throw new Error("TODO");
  }
}

/**
 * EXERCISE 2
 * PriceCalculator with dependency inversion.
 *
 * Create interface TaxPolicy { computeTax(subtotal: number): number }
 * Create class PriceCalculator that receives TaxPolicy in constructor.
 * Method total(subtotal) returns subtotal + tax.
 */

// TODO: add TaxPolicy and PriceCalculator

/**
 * EXERCISE 3
 * Polymorphic notifications.
 *
 * Create interface Notifier { send(userId: string, message: string): Promise<void> }
 * Implement EmailNotifier and SmsNotifier classes.
 * Implement function sendCampaign(notifier, userIds, message) that uses the interface only.
 */

// TODO: add Notifier, EmailNotifier, SmsNotifier, sendCampaign

/**
 * EXERCISE 4
 * InventoryItem encapsulation.
 *
 * Class rules:
 * - constructor(sku: string, stock: number)
 * - getSku(), getStock()
 * - addStock(qty), removeStock(qty)
 * - reject negative qty
 * - reject remove if insufficient stock
 */

// TODO: add InventoryItem class

/**
 * EXERCISE 5
 * Open/Closed via shipping strategy.
 *
 * Create interface ShippingStrategy { fee(weightKg: number): number }
 * Implement StandardShipping and ExpressShipping.
 * Create ShippingService that depends on strategy interface.
 */

// TODO: add shipping strategy classes

/**
 * EXERCISE 6
 * Interface segregation.
 *
 * Create:
 * - ReadableRepo<T> with getById, list
 * - WritableRepo<T> with save, remove
 * - InMemoryRepo<T extends { id: string }> implementing both
 */

// TODO: add repo interfaces and class

/**
 * EXERCISE 7
 * Abstract class for retryable jobs.
 *
 * Create abstract class RetryableJob with:
 * - constructor(maxAttempts: number)
 * - protected abstract runOnce(): Promise<void>
 * - execute(): Promise<void> retries until success or max attempts
 */

// TODO: add RetryableJob

/**
 * EXERCISE 8
 * Liskov-safe media renderers.
 *
 * Create interface Renderer { render(content: string): string }
 * Implement HtmlRenderer and MarkdownRenderer.
 * Function renderPreview(renderer, content) should work for all implementations.
 */

// TODO: add renderer contracts and implementations

/**
 * EXERCISE 9
 * Payment processor with polymorphism.
 *
 * Create enum PaymentMethod { Card, Wallet, BankTransfer }
 * Create interface PaymentProcessor { pay(orderId: string, amount: number): Promise<string> }
 * Implement 2 processors and a PaymentService that selects one by method.
 */

// TODO: add payment abstractions

/**
 * EXERCISE 10
 * User onboarding orchestrator using SRP.
 *
 * Create interfaces:
 * - UserValidator
 * - UserCreator
 * - WelcomeMessenger
 *
 * Create OnboardingService depending on those interfaces only.
 * Method onboard(input) validates -> creates -> sends welcome.
 */

// TODO: add onboarding design

/**
 * ============================================================
 * PROBLEM 1 (Design from scratch)
 * Subscription Billing Engine (SOLID)
 * ============================================================
 *
 * Build a class-based billing module with dependency inversion and polymorphism.
 *
 * 1) Create enum BillingCycle: Monthly, Yearly.
 *
 * 2) Create interfaces:
 *    - Plan { id, name, monthlyPrice }
 *    - DiscountPolicy { apply(amount: number, context: { userId: string; cycle: BillingCycle }): number }
 *    - PaymentGateway { charge(userId: string, amount: number): Promise<{ transactionId: string }> }
 *    - InvoiceRepository { save(invoice: Invoice): void; getById(id: string): Invoice | undefined }
 *
 * 3) Create interface Invoice with:
 *    { id, userId, planId, cycle, subtotal, total, transactionId, createdAtMs }
 *
 * 4) Create class BillingService:
 *    constructor(
 *      plansById: Map<string, Plan>,
 *      discountPolicy: DiscountPolicy,
 *      paymentGateway: PaymentGateway,
 *      invoiceRepo: InvoiceRepository
 *    )
 *
 *    Method chargeSubscription(userId, planId, cycle): Promise<Invoice>
 *    - throw if plan missing
 *    - subtotal = monthlyPrice * 12 for yearly else monthlyPrice
 *    - total = discountPolicy.apply(subtotal, ...)
 *    - charge using paymentGateway
 *    - create + persist invoice
 *    - return invoice
 *
 * Focus: constructor injection, separation of concerns, easy testability.
 */

// TODO: implement Problem 1

/**
 * ============================================================
 * PROBLEM 2 (Design from scratch)
 * Multi-Channel Alerting Platform (Polymorphism)
 * ============================================================
 *
 * Build a polymorphic alerting engine.
 *
 * 1) Create enum AlertSeverity: Info, Warning, Critical.
 *
 * 2) Create interface Alert:
 *    { id, title, message, severity, tags: string[], createdAtMs }
 *
 * 3) Create interface AlertChannel:
 *    - name(): string
 *    - supports(severity: AlertSeverity): boolean
 *    - send(alert: Alert): Promise<void>
 *
 * 4) Create class AlertDispatcher:
 *    - constructor(channels: AlertChannel[])
 *    - dispatch(alert): Promise<Map<string, "sent" | "skipped">>
 *
 * Rules:
 * - For each channel:
 *   - if supports(alert.severity) is false => status "skipped"
 *   - else call send(alert) and mark "sent"
 * - Do not fail whole dispatch if one channel throws; continue others.
 * - Return final status map by channel name.
 *
 * 5) Add at least 3 concrete channels:
 *    - EmailAlertChannel
 *    - SlackAlertChannel
 *    - PagerDutyAlertChannel
 * each with different supports() behavior by severity.
 */

// TODO: implement Problem 2

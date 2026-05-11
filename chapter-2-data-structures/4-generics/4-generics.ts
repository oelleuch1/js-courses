// =============================================================================
// CHAPTER 4 | TypeScript Generics Exercises
// Topics: generic functions, constraints, keyof, indexed access types,
//         generic interfaces, generic classes, utility types, discriminated
//         unions, repositories, caches, event systems, and reusable domain models.
// =============================================================================

// =============================================================================
// GREEN EXERCISE 01
// Domain: Analytics - Paginated Dashboard Results
// Difficulty: Easy
// =============================================================================
/**
 * CONTEXT
 * -------
 * "MetricFlow" displays many kinds of dashboard records:
 *
 *   - revenue rows
 *   - active user rows
 *   - error logs
 *   - conversion events
 *
 * The pagination logic is identical for every record type.
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   type Page<TItem>
 *     - page: number
 *     - pageSize: number
 *     - total: number
 *     - items: TItem[]
 *
 * Implement:
 *
 *   paginate<TItem>(items, page, pageSize): Page<TItem>
 *     - page numbers start at 1
 *     - page less than 1 should behave like page 1
 *     - pageSize less than 1 should behave like pageSize 1
 *     - must return the selected slice
 *     - must not mutate input
 *
 * TASK
 * ----
 * Implement the type and function from scratch.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 01
 * ------------------------------------------------------------------

const dashboardRows = [
  { day: "Monday", revenue: 1200 },
  { day: "Tuesday", revenue: 900 },
  { day: "Wednesday", revenue: 1500 },
];

const firstPage = paginate(dashboardRows, 1, 2);
console.log(firstPage.items.length); // 2
console.log(firstPage.total); // 3
console.log(firstPage.items[0].revenue); // 1200

// =============================================================================
// ORANGE EXERCISE 02
// Domain: Logistics - Generic Priority Queue
// Difficulty: Senior
// =============================================================================
/**
 * CONTEXT
 * -------
 * "ShipFast" processes different kinds of operational jobs:
 *
 *   - package pickup jobs
 *   - customs review jobs
 *   - delivery retry jobs
 *
 * Every job type is different, but the queue behavior is reusable.
 *
 * REQUIREMENTS
 * ------------
 * Implement:
 *
 *   class PriorityQueue<TItem>
 *     - private items: Array<{ item: TItem; priority: number; queuedAtMs: number }>
 *
 * Methods:
 *   - enqueue(item: TItem, priority: number, queuedAtMs = Date.now()): void
 *       higher priority should be processed first
 *
 *   - dequeue(): TItem | undefined
 *       removes and returns the highest-priority item
 *       if priorities tie, older queuedAtMs wins
 *
 *   - peek(): TItem | undefined
 *       returns next item without removing it
 *
 *   - size(): number
 *
 *   - clear(): void
 *
 * TASK
 * ----
 * Implement the class.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 02
 * ------------------------------------------------------------------

type DeliveryJob = {
  shipmentId: string;
  address: string;
};

const queue = new PriorityQueue<DeliveryJob>();

queue.enqueue({ shipmentId: "S-1", address: "Paris" }, 1, 100);
queue.enqueue({ shipmentId: "S-2", address: "Lyon" }, 5, 200);
queue.enqueue({ shipmentId: "S-3", address: "Nice" }, 5, 150);

console.log(queue.peek()?.shipmentId); // "S-3"
console.log(queue.dequeue()?.shipmentId); // "S-3"
console.log(queue.dequeue()?.shipmentId); // "S-2"
console.log(queue.size()); // 1

*/

// =============================================================================
// ORANGE EXERCISE 08
// Domain: Content Platform - Generic Repository with Patches
// Difficulty: Senior
// =============================================================================
/**
 * CONTEXT
 * -------
 * "CreatorHub" stores articles, videos, and newsletters. All content has an id,
 * but each content type has different fields.
 *
 * REQUIREMENTS
 * ------------
 * Reuse or define:
 *
 *   interface HasId<TId>
 *     - id: TId
 *
 * Implement:
 *
 *   class InMemoryRepository<TId, TEntity extends HasId<TId>>
 *     - private records: Map<TId, TEntity>
 *
 * Methods:
 *   - create(entity: TEntity): void
 *       throws Error("Entity already exists: <id>") if id already exists
 *
 *   - update(id: TId, patch: Partial<TEntity>): TEntity
 *       throws Error("Entity not found: <id>") if missing
 *       must not allow id changes from patch
 *       returns updated entity
 *
 *   - findById(id: TId): TEntity | undefined
 *
 *   - list(): TEntity[]
 *
 *   - remove(id: TId): boolean
 *
 * SAFETY EXPECTATION
 * ------------------
 * Return shallow copies from findById, list, and update so callers cannot mutate
 * stored records by changing returned object references.
 *
 * TASK
 * ----
 * Implement the interface and class.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 08
 * ------------------------------------------------------------------

type Article = {
  id: string;
  title: string;
  status: "draft" | "published";
};

const articles = new InMemoryRepository<string, Article>();
articles.create({ id: "A-1", title: "Generics Guide", status: "draft" });

const updatedArticle = articles.update("A-1", { status: "published" });
console.log(updatedArticle.status); // "published"
console.log(articles.findById("A-1")?.title); // "Generics Guide"
console.log(articles.remove("A-404")); // false

*/

// =============================================================================
// ORANGE EXERCISE 09
// Domain: Product Analytics - Typed Event Bus
// Difficulty: Senior
// =============================================================================
/**
 * CONTEXT
 * -------
 * "InsightKit" tracks product events. Each event name has a different payload:
 *
 *   - product:viewed needs productId and userId
 *   - cart:item-added needs productId, quantity, and price
 *   - checkout:completed needs orderId, revenue, and currency
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   type AnalyticsEventMap = {
 *     "product:viewed": { productId: string; userId: string };
 *     "cart:item-added": { productId: string; quantity: number; price: number };
 *     "checkout:completed": { orderId: string; revenue: number; currency: "EUR" | "USD" };
 *   }
 *
 * Implement:
 *
 *   class TypedEventBus<TEvents extends Record<string, unknown>>
 *     - on<K extends keyof TEvents>(eventName: K, handler: (payload: TEvents[K]) => void): void
 *     - emit<K extends keyof TEvents>(eventName: K, payload: TEvents[K]): void
 *     - listenerCount<K extends keyof TEvents>(eventName: K): number
 *
 * TASK
 * ----
 * Implement the event map and class.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 09
 * ------------------------------------------------------------------

const analyticsBus = new TypedEventBus<AnalyticsEventMap>();

analyticsBus.on("cart:item-added", (payload) => {
  console.log(payload.productId);
  console.log(payload.quantity * payload.price);
});

analyticsBus.emit("cart:item-added", {
  productId: "P-1",
  quantity: 2,
  price: 59,
});

console.log(analyticsBus.listenerCount("cart:item-added")); // 1

// analyticsBus.emit("checkout:completed", { productId: "P-1" }); // TypeScript error

*/

// =============================================================================
// RED EXERCISE 10
// Domain: FinTech - Result-Based Transaction Pipeline
// Difficulty: Hard
// =============================================================================
/**
 * CONTEXT
 * -------
 * "PayFlow" processes payment transactions through reusable validation and
 * transformation steps.
 *
 * The platform wants a type-safe pipeline where:
 *
 *   - each step receives one input type
 *   - each step returns a Result with either a value or an error
 *   - the next step can change the value type
 *   - errors stay typed
 *
 * REQUIREMENTS
 * ------------
 * Define:
 *
 *   type Result<TValue, TError = string>
 *     - { ok: true; value: TValue }
 *     - { ok: false; error: TError }
 *
 *   type PipelineStep<TInput, TOutput, TError = string>
 *     - (input: TInput) => Result<TOutput, TError>
 *
 * Implement:
 *
 *   runStep<TInput, TOutput, TError>(input, step)
 *     - returns the step result
 *
 *   chainSteps<TInput, TMiddle, TOutput, TError>(input, first, second)
 *     - runs first
 *     - if first fails, return its error
 *     - if first succeeds, pass first.value to second
 *     - returns Result<TOutput, TError>
 *
 *   mapResult<TValue, TNext, TError>(result, mapper)
 *     - if result fails, return same error
 *     - if result succeeds, return ok result with mapper(result.value)
 *
 * TASK
 * ----
 * Implement all types and functions.
 */

// -> Write your implementation here

/* ------------------------------------------------------------------
 * TEST SCENARIO - Exercise 10
 * ------------------------------------------------------------------

type RawTransaction = {
  transactionId: string;
  amount: number;
  currency: string;
};

type ValidTransaction = RawTransaction & {
  currency: "EUR" | "USD";
};

type SettledTransaction = ValidTransaction & {
  settlementId: string;
};

const validateTransaction: PipelineStep<RawTransaction, ValidTransaction> = (input) => {
  if (input.amount <= 0) {
    return { ok: false, error: "Amount must be positive" };
  }

  if (input.currency !== "EUR" && input.currency !== "USD") {
    return { ok: false, error: "Unsupported currency" };
  }

  return { ok: true, value: input as ValidTransaction };
};

const settleTransaction: PipelineStep<ValidTransaction, SettledTransaction> = (input) => {
  return {
    ok: true,
    value: {
      ...input,
      settlementId: `SET-${input.transactionId}`,
    },
  };
};

const result = chainSteps(
  { transactionId: "TX-1", amount: 99, currency: "EUR" },
  validateTransaction,
  settleTransaction
);

if (result.ok) {
  console.log(result.value.settlementId); // "SET-TX-1"
}

const display = mapResult(result, (tx) => `${tx.transactionId}: ${tx.amount} ${tx.currency}`);
console.log(display); // { ok: true, value: "TX-1: 99 EUR" }

*/

// =============================================================================
// MEGA PROBLEM - OmniMarket Commerce Platform
// Covers ALL Chapter 4 Generics topics
// =============================================================================
/**
 * ============================================================================
 * CONTEXT - OmniMarket: Multi-Domain Commerce Infrastructure
 * ============================================================================
 *
 * OmniMarket powers marketplace sellers, financial payouts, shipment tracking,
 * customer support workflows, and analytics events.
 *
 * The platform wants reusable generic infrastructure instead of rebuilding the
 * same repository, cache, pagination, patch, and event logic for every domain.
 *
 * The goal is to design a type-safe system where:
 * - repositories preserve entity and id types
 * - patch operations use Partial<T> without allowing id changes
 * - selectors use keyof and indexed access types
 * - API responses and results are generic discriminated unions
 * - caches support any key/value pair
 * - event names control payload types
 * - service classes depend on reusable generic contracts
 *
 * ============================================================================
 * WHAT TO BUILD
 * ============================================================================
 *
 * SECTION A - Core Generic Types
 * ------------------------------
 *   interface Identified<TId>
 *     - id: TId
 *
 *   type ApiResponse<TData, TError = string>
 *     - { ok: true; data: TData; receivedAtMs: number }
 *     - { ok: false; error: TError; receivedAtMs: number }
 *
 *   type PageResult<TItem>
 *     - items: TItem[]
 *     - page: number
 *     - pageSize: number
 *     - total: number
 *
 *   type SortDirection = "asc" | "desc"
 *
 *   type Patch<TEntity extends Identified<unknown>>
 *     - Partial<Omit<TEntity, "id">>
 *
 * SECTION B - Generic Utility Functions
 * -------------------------------------
 *   success<TData>(data: TData, receivedAtMs = Date.now()): ApiResponse<TData>
 *
 *   failure<TError = string>(error: TError, receivedAtMs = Date.now()): ApiResponse<never, TError>
 *
 *   selectField<TEntity, TKey extends keyof TEntity>(entity, key): TEntity[TKey]
 *
 *   selectFields<TEntity, TKey extends keyof TEntity>(entity, keys): Pick<TEntity, TKey>
 *
 *   paginate<TItem>(items, page, pageSize): PageResult<TItem>
 *
 *   sortBy<TItem, TKey extends keyof TItem>(items, key, direction): TItem[]
 *     - must not mutate original array
 *     - should support string and number values
 *
 * SECTION C - Generic Repository Contract
 * ---------------------------------------
 *   interface Repository<TId, TEntity extends Identified<TId>>
 *     - create(entity: TEntity): void
 *     - update(id: TId, patch: Patch<TEntity>): TEntity
 *     - findById(id: TId): TEntity | undefined
 *     - list(): TEntity[]
 *     - remove(id: TId): boolean
 *
 *   class InMemoryRepository<TId, TEntity extends Identified<TId>>
 *     - implements Repository<TId, TEntity>
 *     - stores entities in Map<TId, TEntity>
 *     - create throws Error("Entity already exists: <id>") on duplicate
 *     - update throws Error("Entity not found: <id>") when missing
 *     - update cannot change id
 *     - findById, update, and list return shallow copies
 *
 * SECTION D - Generic TTL Cache
 * -----------------------------
 *   class TtlCache<TKey, TValue>
 *     - private store: Map<TKey, { value: TValue; expiresAtMs: number }>
 *     - set(key, value, ttlMs, nowMs = Date.now()): void
 *     - get(key, nowMs = Date.now()): TValue | undefined
 *     - has(key, nowMs = Date.now()): boolean
 *     - cleanup(nowMs = Date.now()): number
 *
 * SECTION E - Typed Event Bus
 * ---------------------------
 *   class EventBus<TEvents extends Record<string, unknown>>
 *     - on<K extends keyof TEvents>(eventName: K, handler: (payload: TEvents[K]) => void): void
 *     - emit<K extends keyof TEvents>(eventName: K, payload: TEvents[K]): void
 *     - listenerCount<K extends keyof TEvents>(eventName: K): number
 *
 * SECTION F - Domain Models
 * -------------------------
 *   type Money = {
 *     amount: number;
 *     currency: "EUR" | "USD";
 *   }
 *
 *   type Product = Identified<string> & {
 *     sellerId: string;
 *     name: string;
 *     price: Money;
 *     stock: number;
 *     category: "electronics" | "books" | "fashion";
 *   }
 *
 *   type Seller = Identified<string> & {
 *     storeName: string;
 *     rating: number;
 *     verified: boolean;
 *   }
 *
 *   type Payout = Identified<number> & {
 *     sellerId: string;
 *     amount: Money;
 *     status: "pending" | "paid" | "failed";
 *   }
 *
 *   type Shipment = Identified<string> & {
 *     orderId: string;
 *     carrier: "DHL" | "UPS" | "LaPoste";
 *     status: "created" | "in_transit" | "delivered";
 *   }
 *
 * SECTION G - Event Map
 * ---------------------
 *   type OmniMarketEvents = {
 *     "product:created": { productId: string; sellerId: string };
 *     "product:stock-low": { productId: string; stock: number };
 *     "payout:paid": { payoutId: number; sellerId: string; amount: Money };
 *     "shipment:delivered": { shipmentId: string; orderId: string };
 *   }
 *
 * SECTION H - Generic Services
 * ----------------------------
 *   class CatalogService
 *     - constructor(productRepository, eventBus, cache)
 *     - createProduct(product): ApiResponse<Product>
 *       saves product, emits "product:created", caches product
 *     - patchProduct(id, patch): ApiResponse<Product>
 *       updates product, emits "product:stock-low" when stock <= 5
 *     - getProduct(id): ApiResponse<Product>
 *       checks cache first, then repository
 *     - listProducts(page, pageSize): ApiResponse<PageResult<Product>>
 *
 *   class SellerService
 *     - constructor(sellerRepository)
 *     - createSeller(seller): ApiResponse<Seller>
 *     - getPublicSellerView(id): ApiResponse<Pick<Seller, "id" | "storeName" | "rating" | "verified">>
 *
 *   class PayoutService
 *     - constructor(payoutRepository, eventBus)
 *     - createPayout(payout): ApiResponse<Payout>
 *     - markPaid(id): ApiResponse<Payout>
 *       updates status to "paid" and emits "payout:paid"
 *
 *   class ShipmentService
 *     - constructor(shipmentRepository, eventBus)
 *     - createShipment(shipment): ApiResponse<Shipment>
 *     - markDelivered(id): ApiResponse<Shipment>
 *       updates status to "delivered" and emits "shipment:delivered"
 *
 * SECTION I - Reporting
 * ---------------------
 *   class ReportingService
 *     - constructor(productRepository, sellerRepository, payoutRepository, shipmentRepository)
 *     - getInventoryValueBySeller(sellerId): Money
 *       sum product.price.amount * product.stock for seller's products
 *     - getTopProductsByStock(limit): Product[]
 *       sort by stock descending
 *     - getPayoutsByStatus(status): Payout[]
 *     - getDeliveredShipments(): Shipment[]
 *
 * SECTION J - FULL TEST SCENARIO
 * ------------------------------
 * Your implementation should support this scenario:
 *
 * const products = new InMemoryRepository<string, Product>();
 * const sellers = new InMemoryRepository<string, Seller>();
 * const payouts = new InMemoryRepository<number, Payout>();
 * const shipments = new InMemoryRepository<string, Shipment>();
 * const events = new EventBus<OmniMarketEvents>();
 * const productCache = new TtlCache<string, Product>();
 *
 * events.on("product:stock-low", (payload) => {
 *   console.log(`${payload.productId} is low: ${payload.stock}`);
 * });
 *
 * const catalog = new CatalogService(products, events, productCache);
 * const sellerService = new SellerService(sellers);
 * const payoutService = new PayoutService(payouts, events);
 * const shipmentService = new ShipmentService(shipments, events);
 *
 * sellerService.createSeller({
 *   id: "S-1",
 *   storeName: "TechStore",
 *   rating: 4.8,
 *   verified: true,
 * });
 *
 * catalog.createProduct({
 *   id: "P-1",
 *   sellerId: "S-1",
 *   name: "Mechanical Keyboard",
 *   price: { amount: 129, currency: "EUR" },
 *   stock: 10,
 *   category: "electronics",
 * });
 *
 * catalog.patchProduct("P-1", { stock: 3 });
 * console.log(catalog.getProduct("P-1").ok); // true
 *
 * payoutService.createPayout({
 *   id: 1,
 *   sellerId: "S-1",
 *   amount: { amount: 500, currency: "EUR" },
 *   status: "pending",
 * });
 *
 * payoutService.markPaid(1);
 *
 * shipmentService.createShipment({
 *   id: "SHIP-1",
 *   orderId: "O-1",
 *   carrier: "DHL",
 *   status: "created",
 * });
 *
 * shipmentService.markDelivered("SHIP-1");
 *
 * const reporting = new ReportingService(products, sellers, payouts, shipments);
 * console.log(reporting.getInventoryValueBySeller("S-1"));
 * console.log(reporting.getTopProductsByStock(5).length);
 * console.log(reporting.getPayoutsByStatus("paid").length);
 * console.log(reporting.getDeliveredShipments().length);
 *
 * SOLID / DESIGN EXPECTATIONS
 * ---------------------------
 * - Repository logic must be generic and reused by all domain entities.
 * - Cache logic must be generic and reusable for any key/value pair.
 * - Event bus must be generic and event-name-safe.
 * - Services must depend on generic contracts where possible.
 * - Utility functions must preserve precise types instead of returning any.
 * - Patch types must prevent id updates at compile time.
 *
 * TASK
 * ----
 * Implement OmniMarket from sections A through I.
 */

// -> Write your OmniMarket implementation here

interface Identified<TId> {
  id: TId;
}

type ApiResponse<TData, TError = string> =
  | { ok: true; data: TData; receivedAtMs: number }
  | { ok: false; error: TError; receivedAtMs: number };

type PageResult<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
};

type SortDirection = "asc" | "desc";

type Patch<TEntity extends Identified<unknown>> = Partial<Omit<TEntity, "id">>;

const success = <TData>(
  data: TData,
  receivedAtMs = Date.now(),
): ApiResponse<TData> => {
  return { ok: true, data, receivedAtMs };
};

const failure = <TError = string>(
  error: TError,
  receivedAtMs = Date.now(),
): ApiResponse<never, TError> => {
  return { ok: false, error, receivedAtMs };
};

const selectField = <TEntity, TKey extends keyof TEntity>(
  entity: TEntity,
  key: TKey,
): TEntity[TKey] => {
  return entity[key];
};

// not sure how to implement this one
// selectFields<TEntity, TKey extends keyof TEntity>(entity, keys): Pick<TEntity, TKey>
const selectFields = <TEntity, TKey extends keyof TEntity>(
  entity: TEntity,
  keys: TKey[],
): Pick<TEntity, TKey> => {
  return keys.reduce(
    (acc, key) => {
      acc[key] = entity[key];
      return acc;
    },
    {} as Pick<TEntity, TKey>,
  );
};

const paginate = <TItem>(
  items: TItem[],
  page: number,
  pageSize: number,
): PageResult<TItem> => {
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total: items.length,
  };
};

// not finished
const sortBy = <TItem, TKey extends keyof TItem>(
  items: TItem[],
  key: TKey,
  direction: SortDirection,
): TItem[] => {};

interface Repository<TId, TEntity extends Identified<TId>> {
  create(entity: TEntity): void;
  update(id: TId, patch: Patch<TEntity>): TEntity;
  findById(id: TId): TEntity | undefined;
  list(): TEntity[];
  remove(id: TId): boolean;
}

class InMemoryRepository<
  TId,
  TEntity extends Identified<TId>,
> implements Repository<TId, TEntity> {
  private readonly entities = new Map<TId, TEntity>();

  create(entity: TEntity): void {
    if (this.entities.has(entity.id)) {
      throw new Error(`Entity already exists: ${entity.id}`);
    }
    this.entities.set(entity.id, entity);
  }

  update(id: TId, patch: Patch<TEntity>): TEntity {
    const entity = this.findById(id);
    if (!entity) {
      throw new Error(`Entity not found: ${id}`);
    }
    return { ...entity, ...patch };
  }

  findById(id: TId): TEntity | undefined {
    return this.entities.get(id);
  }

  list(): TEntity[] {
    return Array.from(this.entities.values());
  }
}

class TtlCache<TKey, TValue> {
  private readonly store = new Map<
    TKey,
    { value: TValue; expiresAtMs: number }
  >();
  private readonly cleanupInterval: number;

  constructor(cleanupInterval: number) {
    this.store = new Map<TKey, { value: TValue; expiresAtMs: number }>();
    this.cleanupInterval = cleanupInterval;
  }

  set(key: TKey, value: TValue, ttlMs: number, nowMs = Date.now()): void {
    this.store.set(key, { value, expiresAtMs: nowMs + ttlMs });
  }

  get(key: TKey, nowMs = Date.now()): TValue | undefined {
    return this.store.get(key)?.value;
  }

  has(key: TKey, nowMs = Date.now()): boolean {
    const entry = this.store.get(key);
    return entry !== undefined && entry.expiresAtMs > nowMs;
  }
}

// *
// * SECTION D - Generic TTL Cache
// * -----------------------------
// *   class TtlCache<TKey, TValue>
// *     - private store: Map<TKey, { value: TValue; expiresAtMs: number }>
// *     - set(key, value, ttlMs, nowMs = Date.now()): void
// *     - get(key, nowMs = Date.now()): TValue | undefined
// *     - has(key, nowMs = Date.now()): boolean
// *     - cleanup(nowMs = Date.now()): number
// *
// * SECTION E - Typed Event Bus
// * ---------------------------
// *   class EventBus<TEvents extends Record<string, unknown>>
// *     - on<K extends keyof TEvents>(eventName: K, handler: (payload: TEvents[K]) => void): void
// *     - emit<K extends keyof TEvents>(eventName: K, payload: TEvents[K]): void
// *     - listenerCount<K extends keyof TEvents>(eventName: K): number
// *

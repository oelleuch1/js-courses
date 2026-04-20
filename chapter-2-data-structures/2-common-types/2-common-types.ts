/**
 * Practice Set: Common Types and Utility Types
 * Complete TODOs with type-safe implementations.
 * - 10 feature-driven exercises
 * - 2 larger design problems (without classes)
 */

/**
 * EXERCISE 1
 * Analytics ingestion:
 * dedupe page view events by `eventId`, preserve first-seen order,
 * and return the unique events plus a Set of distinct user ids.
 *
 * Example:
 * const events = [
 *   { eventId: "e1", userId: "u1", pageId: "home", atMs: 100 },
 *   { eventId: "e2", userId: "u2", pageId: "pricing", atMs: 200 },
 *   { eventId: "e1", userId: "u1", pageId: "home", atMs: 100 }
 * ];
 *
 * normalizePageViews(events) should return:
 * {
 *   uniqueEvents: [
 *     { eventId: "e1", userId: "u1", pageId: "home", atMs: 100 },
 *     { eventId: "e2", userId: "u2", pageId: "pricing", atMs: 200 }
 *   ],
 *   distinctUserIds: Array { "u1", "u2" }
 * }
 */

const s = new Set();

s.add(1);
s.add(1);

// { 1 }
// if it was array => [1, 1]

// eventIds = new Set();
// for of events => eventIds.add(event.eventId)
// eventIds: {  }

export interface PageViewEvent {
  eventId: string;
  userId: string;
  pageId: string;
  atMs: number;
}

export function normalizePageViews(events: PageViewEvent[]): {
  uniqueEvents: PageViewEvent[];
  distinctUserIds: Set<string>;
} {
  const uniqueEvents: PageViewEvent[] = [];
  const distinctUserIds = new Set<string>();
  const seenEventIds = new Set<string>();

  for (const event of events) {
    distinctUserIds.add(event.userId);

    if (!seenEventIds.has(event.eventId)) {
      uniqueEvents.push(event);
      seenEventIds.add(event.eventId);
    }
  }

  return { uniqueEvents, distinctUserIds };
}

export function normalizePageViews2(events: PageViewEvent[]): {
  uniqueEvents: PageViewEvent[];
  distinctUserIds: Set<string>;
} {
  const distinctUserIds = new Set(events.map(event => event.userId));

  const distinctEventIds = new Set(events.map(event => event.eventId)); // { 'e1', 'e2' };
  const uniqueEvents = [...distinctEventIds].map(eventId => events.find(e => e.eventId === eventId)) as PageViewEvent[];

  return { distinctUserIds, uniqueEvents };
}


const demoEvents: PageViewEvent[] = [
  { eventId: "e1", userId: "u1", pageId: "home", atMs: 100 },
  { eventId: "e2", userId: "u2", pageId: "pricing", atMs: 200 },
  { eventId: "e1", userId: "u1", pageId: "home", atMs: 100 },
];

const demoNormalizedPageViews = normalizePageViews2(demoEvents);
// console.log("normalizePageViews uniqueEvents:", demoNormalizedPageViews.uniqueEvents);
// console.log("normalizePageViews distinctUserIds:", [...demoNormalizedPageViews.distinctUserIds]);

/**
 * EXERCISE 2
 * Billing reconciliation:
 * merge usage totals from multiple shards.
 * Input is an array of maps keyed by invoice id.
 * Return one Map with summed totals per invoice.
 *
 * Example:
 * // ['inv-1', 'inv-2', 'inv-3']
 * const shards = [
 *   new Map([
 *     ["inv-1", 100],
 *     ["inv-2", 50]
 *   ]),
 *   new Map([
 *     ["inv-2", 20],
 *     ["inv-3", 10]
 *   ]),*
 *  new Map([
 *     ["inv-1", 20],
 *     ["inv-3", 60]
 *   ]),
 * ];
 *
 * mergeInvoiceTotals(shards) should return:
 * Map {
 *   "inv-1" => 100,
 *   "inv-2" => 70,
 *   "inv-3" => 10
 * }
 */
export function mergeInvoiceTotals(
  shards: Array<Map<string, number>>
): Map<string, number> {
  const mergedTotals = new Map<string, number>();

  for (const shard of shards) {
    for (const [invoiceId, total] of shard) {
      const previousTotal = mergedTotals.get(invoiceId) ?? 0;
      mergedTotals.set(invoiceId, previousTotal + total);
    }
  }

  return mergedTotals;
}

export function mergeInvoiceTotals2(
  shards: Array<Map<string, number>>
): Map<string, number> {

  const invoiceKeys = new Set<string>(); // { 'inv-1', 'inv-2', 'inv-3' }
  const invoiceMap = new Map()
  
  shards.forEach((shard: Map<string, number>) => {
    [...shard.keys()].forEach(invKey => invoiceKeys.add(invKey))
  })

  for (const invK of invoiceKeys) {
    let totalForInvoice = 0;

    shards.forEach((shard: Map<string, number>) => {
      if (shard.has(invK)) {
        totalForInvoice += shard.get(invK)!;
      }
    })

    invoiceMap.set(invK, totalForInvoice)
  }

  return invoiceMap;
}

const demoShards: Array<Map<string, number>> = [
  new Map([
    ["inv-1", 100],
    ["inv-2", 50],
  ]),
  new Map([
    ["inv-2", 20],
    ["inv-3", 10],
  ]),
];

const demoMergedInvoiceTotals = mergeInvoiceTotals2(demoShards);
console.log("mergeInvoiceTotals:", [...demoMergedInvoiceTotals.entries()]);

/**
 * EXERCISE 3
 * Access control:
 * build a permission index from audit rows.
 * Return Map<userId, Set<permission>> using only rows where `granted` is true.
 *
 * Example:
 * const rows = [
 *   { userId: "u1", permission: "reports.read", granted: true },
 *   { userId: "u1", permission: "reports.write", granted: false },
 *   { userId: "u2", permission: "billing.read", granted: true },
 *   { userId: "u1", permission: "reports.read", granted: true }
 * ];
 *
 * buildGrantedPermissionIndex(rows) should return:
 * Map {
 *   "u1" => Set { "reports.read" },
 *   "u2" => Set { "billing.read" }
 * }
 */
export interface PermissionAuditRow {
  userId: string;
  permission: string;
  granted: boolean;
}

export function buildGrantedPermissionIndex(
  rows: PermissionAuditRow[]
): Map<string, Set<string>> {
  const permissionIndex = new Map<string, Set<string>>();

  for (const row of rows) {
    if (!row.granted) {
      continue;
    }

    if (!permissionIndex.has(row.userId)) {
      permissionIndex.set(row.userId, new Set<string>());
    }

    permissionIndex.get(row.userId)!.add(row.permission);
  }

  return permissionIndex;
}

const demoPermissionRows: PermissionAuditRow[] = [
  { userId: "u1", permission: "reports.read", granted: true },
  { userId: "u1", permission: "reports.write", granted: false },
  { userId: "u2", permission: "billing.read", granted: true },
  { userId: "u1", permission: "reports.read", granted: true },
];

const demoPermissionIndex = buildGrantedPermissionIndex(demoPermissionRows);
console.log(
  "buildGrantedPermissionIndex:",
  [...demoPermissionIndex.entries()].map(([userId, permissions]) => [
    userId,
    [...permissions],
  ])
);

/**
 * EXERCISE 4
 * API projection:
 * convert a full customer record into a public card for a list screen.
 * Use `Pick`.
 *
 * Example:
 * const customer = {
 *   id: "c1",
 *   name: "Ada",
 *   email: "ada@company.com",
 *   plan: "pro",
 *   createdAtMs: 1000,
 *   lastLoginAtMs: 2000,
 *   internalNotes: "priority account"
 * };
 *
 * toCustomerListItem(customer) should return:
 * {
 *   id: "c1",
 *   name: "Ada",
 *   email: "ada@company.com",
 *   plan: "pro"
 * }
 */
export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
  createdAtMs: number;
  lastLoginAtMs: number | null;
  internalNotes: string;
}

export function toCustomerListItem(
  customer: CustomerRecord
): Pick<CustomerRecord, "id" | "name" | "email" | "plan"> {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    plan: customer.plan,
  };
}

const demoCustomerRecord: CustomerRecord = {
  id: "c1",
  name: "Ada",
  email: "ada@company.com",
  plan: "pro",
  createdAtMs: 1000,
  lastLoginAtMs: 2000,
  internalNotes: "priority account",
};

const demoCustomerListItem = toCustomerListItem(demoCustomerRecord);
console.log("toCustomerListItem:", demoCustomerListItem);

/**
 * EXERCISE 5
 * Write API payload shaping:
 * prepare a create-user payload from a full customer model.
 * Use `Omit`.
 *
 * Example:
 * const customer = {
 *   id: "c1",
 *   name: "Ada",
 *   email: "ada@company.com",
 *   plan: "pro",
 *   createdAtMs: 1000,
 *   lastLoginAtMs: 2000,
 *   internalNotes: "priority account"
 * };
 *
 * toCreateCustomerPayload(customer) should return:
 * {
 *   name: "Ada",
 *   email: "ada@company.com",
 *   plan: "pro"
 * }
 */
export function toCreateCustomerPayload(
  customer: CustomerRecord
): Omit<CustomerRecord, "id" | "createdAtMs" | "lastLoginAtMs" | "internalNotes"> {
  return {
    name: customer.name,
    email: customer.email,
    plan: customer.plan,
  };
}

const demoCreateCustomerPayload = toCreateCustomerPayload(demoCustomerRecord);
console.log("toCreateCustomerPayload:", demoCreateCustomerPayload);

/**
 * EXERCISE 6
 * Profile patch endpoint:
 * apply an immutable partial update while preventing `id` changes.
 * Use `Partial` and `Omit`.
 *
 * Example:
 * const current = {
 *   id: "u1",
 *   email: "old@company.com",
 *   displayName: "Old Name",
 *   timezone: "UTC",
 *   marketingOptIn: false
 * };
 *
 * const patch = {
 *   displayName: "New Name",
 *   marketingOptIn: true
 * };
 *
 * applyUserProfilePatch(current, patch) should return:
 * {
 *   id: "u1",
 *   email: "old@company.com",
 *   displayName: "New Name",
 *   timezone: "UTC",
 *   marketingOptIn: true
 * }
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  timezone: string;
  marketingOptIn: boolean;
}

export function applyUserProfilePatch(
  current: UserProfile,
  patch: Partial<Omit<UserProfile, "id">>
): UserProfile {
  const updatedProfile: UserProfile = {
    id: current.id,
    email: current.email,
    displayName: current.displayName,
    timezone: current.timezone,
    marketingOptIn: current.marketingOptIn,
  };

  if (patch.email !== undefined) {
    updatedProfile.email = patch.email;
  }
  if (patch.displayName !== undefined) {
    updatedProfile.displayName = patch.displayName;
  }
  if (patch.timezone !== undefined) {
    updatedProfile.timezone = patch.timezone;
  }
  if (patch.marketingOptIn !== undefined) {
    updatedProfile.marketingOptIn = patch.marketingOptIn;
  }

  return updatedProfile;
}

const demoCurrentProfile: UserProfile = {
  id: "u1",
  email: "old@company.com",
  displayName: "Old Name",
  timezone: "UTC",
  marketingOptIn: false,
};

const demoProfilePatch = {
  displayName: "New Name",
  marketingOptIn: true,
};

const demoPatchedProfile = applyUserProfilePatch(demoCurrentProfile, demoProfilePatch);
console.log("applyUserProfilePatch:", demoPatchedProfile);

/**
 * EXERCISE 7
 * Feature flag evaluation:
 * model tenant flags with `Record`, then return enabled keys in stable order.
 *
 * Example:
 * const flags = {
 *   search: true,
 *   checkout: false,
 *   analytics: true,
 *   "bulk-export": false
 * };
 *
 * enabledFeatures(flags) should return:
 * ["search", "analytics"]
 */
export type FeatureKey = "search" | "checkout" | "analytics" | "bulk-export";
export type FeatureFlags = Record<FeatureKey, boolean>;

export function enabledFeatures(flags: FeatureFlags): FeatureKey[] {
  const orderedFeatureKeys: FeatureKey[] = [
    "search",
    "checkout",
    "analytics",
    "bulk-export",
  ];

  const result: FeatureKey[] = [];

  for (const key of orderedFeatureKeys) {
    if (flags[key] === true) {
      result.push(key);
    }
  }

  return result;
}

const demoFeatureFlags: FeatureFlags = {
  search: true,
  checkout: false,
  analytics: true,
  "bulk-export": false,
};

const demoEnabledFeatures = enabledFeatures(demoFeatureFlags);
console.log("enabledFeatures:", demoEnabledFeatures);

/**
 * ============================================================
 * PROBLEM 1 (Design from scratch)
 * Marketplace Orders and Fulfillment Queue
 * ============================================================
 *
 * Build a feature-oriented marketplace order module using:
 * - functions
 * - interfaces
 * - type aliases
 * - arrays
 * - Map / Set
 * - utility types
 * - special types where useful
 *
 * Choose the right type design yourself.
 *
 * 1) Define the right type for order state.
 *    Values include:
 *    - pending
 *    - paid
 *    - packed
 *    - shipped
 *
 * 2) Create types/interfaces:
 *    - MarketplaceOrder {
 *        id,
 *        customerId,
 *        sellerId,
 *        itemIds: string[],
 *        totalAmount,
 *        state,
 *        tags: Set<string>,
 *        createdAtMs
 *      }
 *    - DraftMarketplaceOrder as MarketplaceOrder without `id`, `state`, and `createdAtMs`
 *    - SellerProfile {
 *        id,
 *        displayName,
 *        supportedTags: Set<string>,
 *        maxOpenOrders: number
 *      }
 *    - FulfillmentDecision:
 *      - success case with orderId and nextState
 *      - failure case with orderId and reason
 *
 * 3) Implement:
 *    - createOrder(input: DraftMarketplaceOrder, nextId: string, nowMs?: number): MarketplaceOrder
 *      Rule: new orders start in pending state
 *    - indexOrdersBySeller(orders): Map<sellerId, MarketplaceOrder[]>
 *    - groupOrdersByState(orders): Map<state, MarketplaceOrder[]>
 *    - collectPriorityTags(orders): Set<string>
 *      Rule: return tags from orders in pending or paid state
 *    - decideFulfillment(
 *        order,
 *        sellerById,
 *        openOrderCountBySellerId
 *      ): FulfillmentDecision
 *
 * Rules for decideFulfillment:
 * - If seller does not exist, return failure.
 * - If order state is not `paid`, return failure.
 * - Seller can fulfill the order only if open order count is strictly less than `maxOpenOrders`.
 * - If seller cannot fulfill more orders, return failure with a helpful reason.
 * - Otherwise return success with next state `packed`.
 *
 * Expectations:
 * - choose a state representation that gives strong type safety
 * - use Set/Map intentionally, not just because they exist
 * - keep insertion order when grouping orders
 */

// TODO: add your types and functions for Problem 1

/**
 * ============================================================
 * PROBLEM 2 (Design from scratch, no classes)
 * Async Task Tracker and Delivery Dashboard
 * ============================================================
 *
 * Build a task-tracking module using:
 * - functions
 * - interfaces
 * - type aliases
 * - arrays
 * - Map / Set
 * - utility types
 * - special types where useful
 *
 * Choose the right state representation yourself. Do not default to `enum`.
 *
 * 1) Define the right type for task state.
 *    Values include:
 *    - pending
 *    - running
 *    - done
 *    - failed
 *
 * 2) Create types/interfaces:
 *    - Task { id, title, ownerId, state, tags: Set<string>, updatedAtMs }
 *    - CreateTaskInput as Task without `id` and `updatedAtMs`
 *    - TaskPatch that allows updating only `title`, `ownerId`, `state`, and `tags`
 *    - TaskSummary with only `id`, `title`, and `state`
 *    - TaskResult:
 *      - success case with `task`
 *      - failure case with `reason`
 *
 * 3) Implement:
 *    - createTask(input: CreateTaskInput, nextId: string, nowMs?: number): Task
 *    - updateTask(task: Task, patch: TaskPatch, nowMs?: number): Task
 *    - summarizeTasks(tasks): TaskSummary[]
 *    - groupTasksByState(tasks): Map<state, Task[]>
 *    - buildOwnerTaskIndex(tasks): Map<ownerId, Task[]>
 *    - collectHotTags(tasks): Set<string>
 *      Rule: include tags from tasks in running or failed state
 *    - transitionTask(task: Task, nextState, nowMs?: number): TaskResult
 *
 * Rules for transitionTask:
 * - pending -> running | failed
 * - running -> done | failed
 * - failed -> pending
 * - done -> no transition
 * - Return a failure result instead of throwing for invalid transitions.
 *
 * Expectations:
 * - use utility types to avoid repeating object shapes
 * - keep functions feature-driven, not toy examples
 * - model transitions and invalid states clearly
 */

// TODO: add your types and functions for Problem 2

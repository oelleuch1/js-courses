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
  const distinctUserIds = new Set(events.map((event) => event.userId));

  const distinctEventIds = new Set(events.map((event) => event.eventId)); // { 'e1', 'e2' };
  const uniqueEvents = [...distinctEventIds].map((eventId) =>
    events.find((e) => e.eventId === eventId),
  ) as PageViewEvent[];

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
  shards: Array<Map<string, number>>,
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
  shards: Array<Map<string, number>>,
): Map<string, number> {
  const invoiceKeys = new Set<string>(); // { 'inv-1', 'inv-2', 'inv-3' }
  const invoiceMap = new Map();

  shards.forEach((shard: Map<string, number>) => {
    [...shard.keys()].forEach((invKey) => invoiceKeys.add(invKey));
  });

  for (const invK of invoiceKeys) {
    let totalForInvoice = 0;

    shards.forEach((shard: Map<string, number>) => {
      if (shard.has(invK)) {
        totalForInvoice += shard.get(invK)!;
      }
    });

    invoiceMap.set(invK, totalForInvoice);
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
 *   { userId: "u1", permission: "billing.read", granted: true }
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
  rows: PermissionAuditRow[],
): Map<string, Set<string>> {
  // define a variable to store the granted true rows
  // loop over the rows and choose only the granted rows, put then into a map of sets?
  // return the map of sets

  //Create an empty map
  // if row is granted false then skip
  // if no userId then create
  // add the permission

  const permissionMap = new Map<string, Set<string>>();

  rows.forEach((row: PermissionAuditRow) => {
    if (!row.granted) {
      return;
    } else {
      if (permissionMap.has(row.userId)) {
        const grantedPermissions = permissionMap.get(row.userId);
        grantedPermissions?.add(row.permission);
        permissionMap.set(row.userId, grantedPermissions);
      } else {
        permissionMap.set(row.userId, new Set([row.permission]));
      }
    }
  });
  return permissionMap;
}

const demoPermissionRows: PermissionAuditRow[] = [
  { userId: "u1", permission: "reports.read", granted: true },
  { userId: "u1", permission: "reports.write", granted: false },
  { userId: "u2", permission: "billing.read", granted: true },
  { userId: "u1", permission: "billing.read", granted: true },
];

console.log(
  "buildGrantedPermissionIndex:",
  buildGrantedPermissionIndex(demoPermissionRows),
);

/**
 * EXERCISE 4
 * API projection:
 * convert a full customer record into a public card for a list screen.
 * Use `Pick`.
 *
 * Example:
 *
 * toCustomerListItem(customer) should return:
 * {
 *   id: "c1",
 *   name: "Ada",
 *   email: "ada@company.com",
 *   plan: "pro"
 * }
 */
const customer = {
  id: "c1",
  name: "Ada",
  email: "ada@company.com",
  plan: "pro",
  createdAtMs: 1000,
  lastLoginAtMs: 2000,
  internalNotes: "priority account",
};
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
  customer: CustomerRecord,
): Pick<CustomerRecord, "id" | "name" | "email" | "plan"> {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    plan: customer.plan,
  };
}

console.log(
  "toCustomerListItem:",
  toCustomerListItem(customer as CustomerRecord),
);

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
  customer: CustomerRecord,
): Omit<
  CustomerRecord,
  "id" | "createdAtMs" | "lastLoginAtMs" | "internalNotes"
> {
  return { name: customer.name, email: customer.email, plan: customer.plan };
}

// const demoCreateCustomerPayload = toCreateCustomerPayload(demoCustomerRecord);
console.log(
  "toCreateCustomerPayload:",
  toCreateCustomerPayload(customer as CustomerRecord),
);

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
const current = {
  id: "u1",
  email: "old@company.com",
  displayName: "Old Name",
  timezone: "UTC",
  marketingOptIn: false,
};

const patch = {
  displayName: "New Name",
  marketingOptIn: true,
};
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  timezone: string;
  marketingOptIn: boolean;
}

export function applyUserProfilePatch(
  current: UserProfile,
  patch: Partial<Omit<UserProfile, "id">>,
): UserProfile {
  return { ...current, ...patch };
}

console.log("applyUserProfilePatch:", applyUserProfilePatch(current, patch));

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

const flags: FeatureFlags = {
  search: true,
  checkout: false,
  analytics: true,
  "bulk-export": false,
  // payment: false,
};
export type FeatureKey = "search" | "checkout" | "analytics" | "bulk-export";
export type FeatureFlags = Record<FeatureKey, boolean>;

export function enabledFeatures(flags: FeatureFlags): FeatureKey[] {
  const keys = Object.keys(flags);
  return keys.filter((key) => flags[key]);
}

console.log("enabledFeatures:", enabledFeatures(flags));

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
 *    - indexOrdersBySeller(orders): Map<sellerId, MarketplaceOrder[], >
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

type OrderState = "pending" | "paid" | "packed" | "shipped";
//enums

interface MarketplaceOrder {
  id: string;
  customerId: string;
  sellerId: string;
  itemIds: string[];
  totalAmount: number;
  state: OrderState;
  tags: Set<string>;
  createdAtMs: number;
}

type DraftMarketplaceOrder = Omit<
  MarketplaceOrder,
  "id" | "state" | "createdAtMs"
>;

interface SellerProfile {
  id: string;
  displayName: string;
  supportedTags: Set<string>;
  maxOpenOrders: number;
}

interface success {
  orderId: string;
  nextState: OrderState;
  case: "success";
}

interface failure {
  orderId: string;
  reason: string;
  case: "failure";
}

type FulfillmentDecision = success | failure;

const createOrder = (
  input: DraftMarketplaceOrder,
  nextId: string,
  nowMs?: number,
): MarketplaceOrder => {
  // create order
  // start with pending state
  const newOrder: MarketplaceOrder = {
    ...input,
    id: nextId,
    createdAtMs: nowMs ?? 0,
    state: "pending",
  };
  //input add  nextId, state === pending, createdAtMs: nowMs
  return newOrder;
};

const orders: MarketplaceOrder[] = [
  {
    id: "1",
    customerId: "C1",
    sellerId: "S1",
    itemIds: [],
    totalAmount: 10,
    state: "pending",
    tags: new Set(),
    createdAtMs: 10000,
  },
  {
    id: "2",
    customerId: "C1",
    sellerId: "S2",
    itemIds: [],
    totalAmount: 10,
    state: "packed",
    tags: new Set(),
    createdAtMs: 10000,
  },
  {
    id: "3",
    customerId: "C2",
    sellerId: "S1",
    itemIds: [],
    totalAmount: 10,
    state: "packed",
    tags: new Set(),
    createdAtMs: 10000,
  },
];

const indexOrdersBySeller = (
  orders: MarketplaceOrder[],
): Map<MarketplaceOrder["sellerId"], MarketplaceOrder[]> => {
  // store seller ID in set
  // traverse throught the array of MO and check for ids of 1 selelr and add those to seller []

  const sellerSet = new Set(orders.map((order) => order.sellerId));

  const result: Map<MarketplaceOrder["sellerId"], MarketplaceOrder[]> =
    new Map();

  for (let seller of sellerSet) {
    result.set(
      seller,
      orders.filter((order) => order.sellerId === seller),
    );
  }
  return result;
};

console.log("indexOrder", indexOrdersBySeller(orders));

const groupOrdersByState = (
  orders: MarketplaceOrder[],
): Map<OrderState, MarketplaceOrder[]> => {
  // store state in set
  // traverse throught the array of MO and check for state and add those to state []

  const stateSet = new Set(orders.map((order) => order.state));
  const group = new Map<OrderState, MarketplaceOrder[]>();

  for (let state of stateSet) {
    group.set(
      state,
      orders.filter((order) => order.state === state),
    );
  }

  return group;
};

console.log("groupOrdersByState", groupOrdersByState(orders));

const collectPriorityTags = (orders: MarketplaceOrder[]): Set<string> => {
  // store tags in set
  // traverse throught the array of MO and check for tags and add those to set

  const tagSet = new Set<string>();

  for (let order of orders) {
    if (order.state === "pending" || order.state === "paid") {
      for (let tag of order.tags) {
        tagSet.add(tag);
      }
    }
  }

  return tagSet;
};

console.log("collectPriorityTags", collectPriorityTags(orders));
//  { S1: 2, S2, 10 }

const decideFulfillment = (
  order: MarketplaceOrder,
  sellerById: Map<string, SellerProfile>,
  openOrderCountBySellerId: Map<string, number>,
): FulfillmentDecision => {
  // check if seller exists
  // check if order is paid
  // check if seller can fulfill more orders
  // return success or failure

  if (!sellerById.has(order.sellerId)) {
    return { case: "failure", orderId: order.id, reason: "Seller not found" };
  }
  if (order.state !== "paid") {
    return { case: "failure", orderId: order.id, reason: "Order is not paid" };
  }
  if (
    openOrderCountBySellerId.get(order.sellerId) >=
    sellerById.get(order.sellerId)?.maxOpenOrders
  ) {
    return {
      case: "failure",
      orderId: order.id,
      reason: "Seller has max open orders",
    };
  }
  return { case: "success", orderId: order.id, nextState: "packed" };
};

console.log(
  "decideFulfillment",
  decideFulfillment(orders[0], new Map(), new Map()),
);

/**
 * ============================================================
 * PROBLEM 2 (Design from scratch, no classes)
 * Async Task Tracker and Delivery Dashboard
 * ============================================================
 *
 * with enum
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
 * 1) Define the right type for task state. // enum is required
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

enum TaskState {
  Pending = "pending",
  Running = "running",
  Done = "done",
  Failed = "failed",
}

interface Task {
  id: string;
  title: string;
  ownerId: string;
  state: TaskState;
  tags: Set<string>;
  updatedAtMs: number;
}

type CreateTaskInput = Omit<Task, "id" | "updatedAtMs">;

type TaskPatch = Partial<Omit<Task, "id">>;

type TaskSummary = Pick<Task, "id" | "title" | "state">;

interface TaskSuccess {
  case: "success";
  task: Task;
}

interface TaskFailure {
  case: "failure";
  reason: string;
}

type TaskResult = TaskSuccess | TaskFailure;

const createTask = (
  input: CreateTaskInput,
  nextId: string,
  nowMs?: number,
): Task => {
  // create a variable to store the new task
  // combine input, id, ms into one and return as task

  const task: Task = {
    ...input,
    id: nextId,
    updatedAtMs: nowMs ?? 0,
  };

  return task;
};
console.log(
  "createTask",
  createTask(
    {
      title: "Task 1",
      ownerId: "user1",
      state: TaskState.Pending,
      tags: new Set(),
    },
    "1",
    1000,
  ),
);

const updateTask = (task: Task, patch: TaskPatch, nowMs?: number): Task => {
  const updatedTask: Task = {
    ...task,
    ...patch,
    updatedAtMs: nowMs ?? 0,
  };

  return updatedTask;
};

console.log(
  "updateTask",
  updateTask(
    {
      id: "1",
      title: "Task 1",
      ownerId: "user1",
      state: TaskState.Pending,
      tags: new Set(),
      updatedAtMs: 1000,
    },
    {
      title: "Task 1 updated",
      state: TaskState.Running,
    },
    2000,
  ),
);

const summarizeTasks = (tasks: Task[]): TaskSummary[] => {
  const summary: TaskSummary[] = [];
  for (let task of tasks) {
    summary.push({
      id: task.id,
      title: task.title,
      state: task.state,
    });
  }

  return summary;
};
console.log(
  "summarizeTasks",
  summarizeTasks([
    {
      id: "t1",
      title: "Write docs",
      ownerId: "u1",
      state: TaskState.Pending,
      tags: new Set(["docs"]),
      updatedAtMs: 1000,
    },
    {
      id: "t2",
      title: "Fix bug",
      ownerId: "u2",
      state: TaskState.Running,
      tags: new Set(["bug"]),
      updatedAtMs: 1100,
    },
  ]),
);

const groupTasksByState = (tasks: Task[]): Map<TaskState, Task[]> => {
  const stateGroup = new Map<TaskState, Task[]>();
  const stateSet = new Set<TaskState>(tasks.map((task: Task) => task.state));

  for (let state of stateSet) {
    const sameStateTasks = tasks.filter((task: Task) => task.state === state);
    stateGroup.set(state, sameStateTasks);
  }
  return stateGroup;
};

console.log(
  "groupTasksByState",
  groupTasksByState([
    {
      id: "t1",
      title: "Write docs",
      ownerId: "u1",
      state: TaskState.Pending,
      tags: new Set(["docs"]),
      updatedAtMs: 1000,
    },
    {
      id: "t2",
      title: "Fix bug",
      ownerId: "u2",
      state: TaskState.Running,
      tags: new Set(["bug"]),
      updatedAtMs: 1100,
    },
    {
      id: "t3",
      title: "Write code",
      ownerId: "u3",
      state: TaskState.Done,
      tags: new Set(["code"]),
      updatedAtMs: 1200,
    },
  ]),
);

const buildOwnerTaskIndex = (tasks: Task[]): Map<string, Task[]> => {
  const ownerTaskIndex = new Map<string, Task[]>();
  const ownerSet = new Set(tasks.map((task) => task.ownerId));

  for (let owner of ownerSet) {
    ownerTaskIndex.set(
      owner,
      tasks.filter((task) => task.ownerId === owner),
    );
  }
  return ownerTaskIndex;
};

console.log(
  "buildOwnerTaskIndex",
  buildOwnerTaskIndex([
    {
      id: "t1",
      title: "Write docs",
      ownerId: "u1",
      state: TaskState.Pending,
      tags: new Set(["docs"]),
      updatedAtMs: 1000,
    },
    {
      id: "t2",
      title: "Fix bug",
      ownerId: "u2",
      state: TaskState.Running,
      tags: new Set(["bug"]),
      updatedAtMs: 1100,
    },
    {
      id: "t3",
      title: "Fix another bug",
      ownerId: "u2",
      state: TaskState.Running,
      tags: new Set(["bug"]),
      updatedAtMs: 1100,
    },
  ]),
);

const collectHotTags = (tasks: Task[]): Set<string> => {
  const hotTags = new Set<string>();
  const filteredTasks = tasks.filter(
    (task) =>
      task.state === TaskState.Running || task.state === TaskState.Failed,
  );

  for (let tag of filteredTasks) {
    for (let singleTag of tag.tags) {
      hotTags.add(singleTag);
    }
  }

  return hotTags;
};

console.log(
  "collectHotTags",
  collectHotTags([
    {
      id: "t1",
      title: "Write docs",
      ownerId: "u1",
      state: TaskState.Pending,
      tags: new Set(["docs"]),
      updatedAtMs: 1000,
    },
    {
      id: "t2",
      title: "Fix bug",
      ownerId: "u2",
      state: TaskState.Running,
      tags: new Set(["bug"]),
      updatedAtMs: 1100,
    },
    {
      id: "t3",
      title: "Write code",
      ownerId: "u3",
      state: TaskState.Running,
      tags: new Set(["code"]),
      updatedAtMs: 1200,
    },
  ]),
);

const transitionTask = (
  task: Task,
  nextState: TaskState,
  nowMs?: number,
): TaskResult => {
  if (task.state === TaskState.Pending) {
    if (nextState === TaskState.Running) {
      return {
        case: "success",
        task: {
          ...task,
          state: TaskState.Running,
          updatedAtMs: nowMs ?? task.updatedAtMs,
        },
      };
    } else if (nextState === TaskState.Failed) {
      return {
        case: "success",
        task: {
          ...task,
          state: TaskState.Failed,
          updatedAtMs: nowMs ?? task.updatedAtMs,
        },
      };
    }
  }

  if (task.state === TaskState.Running) {
    if (nextState === TaskState.Done) {
      return {
        case: "success",
        task: {
          ...task,
          state: TaskState.Done,
          updatedAtMs: nowMs ?? task.updatedAtMs,
        },
      };
    } else if (nextState === TaskState.Failed) {
      return {
        case: "success",
        task: {
          ...task,
          state: TaskState.Failed,
          updatedAtMs: nowMs ?? task.updatedAtMs,
        },
      };
    }
  }

  if (task.state === TaskState.Failed) {
    if (nextState === TaskState.Pending) {
      return {
        case: "success",
        task: {
          ...task,
          state: TaskState.Pending,
          updatedAtMs: nowMs ?? task.updatedAtMs,
        },
      };
    }
  }

  if (task.state === TaskState.Done) {
    return {
      case: "failure",
      reason: "Done tasks cannot transition",
    };
  }

  return { case: "failure", reason: "Invalid transition" };
};

console.log(
  "transitionTask",
  transitionTask(
    {
      id: "t9",
      title: "Release app",
      ownerId: "u9",
      state: TaskState.Pending,
      tags: new Set(["release"]),
      updatedAtMs: 1000,
    },
    TaskState.Running,
    2000,
  ),
);

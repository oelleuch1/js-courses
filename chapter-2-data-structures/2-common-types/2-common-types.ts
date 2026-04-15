/**
 * Practice Set: Common Types and Utility Types
 * Complete TODOs with type-safe implementations.
 * - 10 feature-driven exercises
 * - 2 larger design problems (without classes)
 */

/**
 * EXERCISE 1
 * Analytics: return distinct page ids visited in first-seen order.
 */
export function uniqueVisitedPages(pageIds: string[]): Set<string> {
  // TODO
  throw new Error("TODO");
}

/**
 * EXERCISE 2
 * Billing: merge two invoice amount maps by invoice id.
 * If id exists in both maps, sum values.
 */
export function mergeInvoiceTotals(
  firstInvoice: Map<string, number>,
  secondInvoice: Map<string, number>
): Map<string, number> {
  // TODO
  throw new Error("TODO");
}

/**
 * EXERCISE 4
 * Utility type: create a compact contact card from a full customer model.
 * Use `Pick`.
 */
export interface CustomerContactSource {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  createdAtMs: number;
}

export function mapCustomerSourceToCustomerContact(
  customer: CustomerContactSource
): Pick<CustomerContactSource, "id" | "email" | "name"> {
  // TODO
  throw new Error("TODO");
}

/**
 * EXERCISE 5
 * Utility type: remove internal fields from a customer record before returning it to the client.
 * Use `Omit`.
 */
export interface Customer {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  internalNotes: string;
  createdAtMs: number;
}

export function toPublicCustomer(
  customer: Customer
): Omit<Customer, "internalNotes"> {
  // TODO
  throw new Error("TODO");
}

/**
 * EXERCISE 6
 * Utility type: apply a partial profile patch immutably.
 * Use `Partial`.
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  marketingOptIn: boolean;
}

export function applyUserProfilePatch(
  profile: UserProfile,
  patch: Partial<Omit<UserProfile, "id">>
): UserProfile {
  throw new Error("TODO");
}

/**
 * EXERCISE 7
 * Utility type: accept readonly deployment config and return a mutable copy.
 * Use `Readonly`.
 */
export interface DeploymentConfig {
  region: string;
  autoScale: boolean;
}

export function cloneDeploymentConfigWithEURegion(
  config: Readonly<DeploymentConfig>
): DeploymentConfig {
  throw new Error("TODO");
}

/**
 * EXERCISE 8
 * Utility type: track feature flags with `Record`.
 */
export type FeatureKey = "search" | "checkout" | "analytics";
export type FeatureFlags = Record<FeatureKey, boolean>;

export function enabledFeatures(flags: FeatureFlags): FeatureKey[] {
  return [];
}

/**
 * ============================================================
 * PROBLEM 1 (Design from scratch)
 * Incident Routing Engine
 * ============================================================
 *
 * Build a feature-oriented incident routing module using only:
 * - functions
 * - interfaces
 * - type aliases
 * - Map/Set
 * - utility types when they help
 *
 * 1) Define a severity model for incidents.
 *    Pick the data structure you think fits best for values like:
 *    - low
 *    - medium
 *    - high
 *    - critical
 *
 * 2) Create this custom types:
 *    - Incident { id, title, service, severity, tags, createdAtMs }
 *    - Engineer { id, name, skills, maxLoad: number }
 *    - DraftIncident is Incident without id and createdAtMs
 *
 * 3) Create `AssignmentResult` which contains ok: true/false, incidentId: string, in case of ok true, engineerId: string or reason: string
 *

/**
 * ============================================================
 * PROBLEM 2 (Design from scratch)
 * Async Task Tracker
 * ============================================================
 *
 * Build a task tracking module using only common types and utility types.
 *
 * 1) Define the right type for task state.
 *    - pending
 *    - running
 *    - done
 *    - failed
 *
 * 2) Create custom types:
 *    - Task { id, title, ownerId, state, tags, updatedAtMs }
 *    - CreateTaskInput is a Task without `id` and `updatedAtMs`
 *
 * 3) Create utility-driven helper types:
 *    - TaskPatch: allow updating only `title`, `ownerId`, and `state`
 *    - TaskSummary: compact public view with only `id`, `title`, and `state`
 *
 * 4) Implement:
 *    - createTask(task: CreateTaskInput, nextId: string): Task
 *    - updateTask(task: Task, patch: TaskPatch): Task
 *    - groupTasksByState(tasks): Map<state, Task[]>
 *    - summarizeTasks(tasks): TaskSummary[]
 *
 * Rules:
 * - `id` must not change after creation.
 * - `updatedAtMs` should change when task is updated.
 * - `groupTasksByState` should preserve insertion order inside each group.
 * - `summarizeTasks` must not leak extra fields.
 */

// TODO: add your state type, interfaces, utility types, and functions for Problem 2

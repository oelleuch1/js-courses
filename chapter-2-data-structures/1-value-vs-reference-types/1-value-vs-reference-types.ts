// Value vs Reference Practice

// 1. Check if a config value (currency code, locale, etc.) is a primitive.
export function isPrimitive(value: unknown): boolean {
  // TODO: implement
  return false;
}

// 2. Produce a shallow copy of a user profile when applying a quick UI edit.
export function shallowCopyProfile<T extends object>(profile: T): T {
  // TODO: implement
  return profile;
}

// 3. Deep-clone a checkout payload before sending it to the payments API.
export function deepClonePayload<T>(payload: T): T {
  // TODO: implement
  return payload;
}

// 4. Detect if two cache entries point to the same object (to skip redundant writes).
export function isSameReference(a: unknown, b: unknown): boolean {
  // TODO: implement
  return false;
}

// 5. Add a line item to an order without mutating the original array.
export function addLineItem<T>(items: ReadonlyArray<T>, item: T): T[] {
  // TODO: implement
  return [];
}

// 6. Merge user settings with environment defaults; ensure nested objects are not shared.
export function mergeSettings<T extends object, U extends object>(user: T, env: U): T & U {
  // TODO: implement
  return {} as T & U;
}

// 7. Diff audit snapshots of an account record; return fields that changed.
export function diffAudit(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): string[] {
  // TODO: implement
  return [];
}


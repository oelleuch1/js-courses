// Value vs Reference Practice
let a = 1;
let b = 2; //(value)
a = b;

a = 3;

console.log('a', a)
console.log('b', b)

let objA = { name: 'Alice' } // ref: uuid1, value: { name: 'Alice' }
let objB =  { name: 'Alice' }; // newRef
// (ref, value)

objB.name = 'Bob';
// objA.name = 'Bob

console.log(objA === objB); // compare the ref not the value;

let arrayA = ['Alice'];
let arrayB = ['Alice'];

console.log('are objects equals', objA == objB)
console.log('are arrays equals', arrayA == arrayB)

objA = objB;
console.log('are objects equals after assignment', objA == objB)

let user1 = { name: 'Alice' } // ref: uuid1, value: { name: 'Alice' }
let user2 =  { name: 'Bob' } // ref: uuid2, value: { name: 'Bob' }

user1 = user2;
// user1 // ref: uuid2, value: { name: 'Bob' }
// user2 // ref: uuid2, value: { name: 'Bob' }

user1.name = 'Alice';
console.log(user1, user2)


let x = 2;
let y = "2";
// === for type and value but == is only for value


const users = ['Alice'];

const alias = [...users];
alias.push('Bob');



const usersObjs = [ { name: 'Alice' } ];

const aliasObjs = structuredClone(usersObjs);
aliasObjs[0].name = 'Bob'

// if aliasObjs is a new copy of usersObjs 
console.log({ usersObjs, aliasObjs })


const userAObj = {
  value: 'userA',
  person: { name: 'Alice' }
 }

const userBObj = { ...userAObj };
userBObj.person.name = 'Bob'
userBObj.value = 'userB'

console.log({ userAObj, userBObj })

// 1. Check if a config value (currency code, locale, etc.) is a primitive.
export function isPrimitive(value: unknown): boolean {
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


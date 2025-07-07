// GENERIC FUNCTIONS
// ----------------

//! PROBLEM: Functions that work with multiple types lack type safety

// Bad approach: Using 'any' for flexible functions
function mergeObjects_Bad(obj1: any, obj2: any): any {
  return { ...obj1, ...obj2 };
}

// Usage example
const person = { name: "Alice" };
const details = { age: 30 };

// Problem 1: No type safety on inputs
mergeObjects_Bad(42, "not an object"); // No error!

// Problem 2: Return type is 'any', losing all type information
const merged = mergeObjects_Bad(person, details);
merged.nonExistentProperty; // No error! TypeScript doesn't know the shape

//! SOLUTION: Using generics to preserve type information

// Good approach: Using generics to maintain type safety
function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U
): T & U {
  return { ...obj1, ...obj2 };
}

// Usage example with generics
const person2 = { name: "Bob" };
const details2 = { age: 25 };

// Benefits:
// 1. Type safety on inputs - must be objects
// mergeObjects(42, "not an object"); // Error! Arguments must be objects

// 2. Return type preserves the shape of both objects
const merged2 = mergeObjects(person2, details2);
// TypeScript knows merged2 has both name and age properties
console.log(merged2.name); // OK
console.log(merged2.age); // OK
// merged2.nonExistentProperty; // Error! Property doesn't exist

// 3. Works with any object types
interface UserData {
  id: string;
  username: string;
}

interface UserPreferences {
  theme: string;
  notifications: boolean;
}

const userData: UserData = { id: "1", username: "alice" };
const preferences: UserPreferences = { theme: "dark", notifications: true };

const userWithPrefs = mergeObjects(userData, preferences);
// TypeScript knows the exact shape: UserData & UserPreferences
console.log(userWithPrefs.username); // OK
console.log(userWithPrefs.notifications); // OK

//! Get middle element of array

function getMiddleElement<T>(array: T[]): T {
  return array[Math.floor(array.length / 2)];
}

const middleElement = getMiddleElement([1, 2, 3, 4, 5]);
console.log(middleElement); //

//! Batch array into chunks
// Sometimes this is needed for processing data in batches

function batchArray<T>(array: T[], maxBatchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += maxBatchSize) {
    batches.push(array.slice(i, i + maxBatchSize));
  }
  return batches;
}

const batch = batchArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
console.log(batch); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

const batch2 = batchArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4);
console.log(batch2); // [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10]]

//! Create a function that returns a promise from supplied value

function createPromise<T>(value: T): Promise<T> {
  return new Promise((resolve) => resolve(value));
}

const promise = createPromise(1);
promise.then((value) => console.log(value)); // 1

//! Track function time

function trackTime<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = Date.now();
    const result = fn(...args);
    const end = Date.now();
    console.log(`Time taken: ${end - start}ms`);
    return result;
  }) as T;
}

function longRunningFunction(a: number, b: number) {
  for (let i = 0; i < 1000000000; i++) {
    Math.sqrt(Math.random());
  }
  return a + b;
}

const tracked = trackTime(longRunningFunction);
const result = tracked(1, 2); // Time taken: 4661ms
console.log(result); // 3

//! More complex examples:

//! Conditional API response type

type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.status === "success") {
    // T is available here
    return response.data;
  } else {
    throw new Error(response.error);
  }
}

//! Deep read-only object

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

//! Transform function - function that transforms one type into another

function transform<T, U>(value: T[], transformer: (value: T) => U): U[] {
  return value.map(transformer);
}

const numbers = [1, 2, 3, 4, 5];
const transformed = transform(numbers, (x) => String(x));
console.log(transformed); // ["1", "2", "3", "4", "5"]

//! Transform based on parameter

// function that takes a number and type parameter, if the type is number, it returns that number, if the type is string, it returns number in a string,
// if the type is boolean, it returns a boolean

function transformBasedOnParameter<T extends "num" | "str" | "bool">(
  value: number,
  type: T
): T extends "num" ? number : T extends "str" ? string : boolean {
  if (type === "num") {
    return value as any;
  } else if (type === "str") {
    return String(value) as any;
  } else if (type === "bool") {
    return Boolean(value) as any;
  } else {
    throw new Error("Invalid type");
  }
}

const numberResult = transformBasedOnParameter(1, "num");
console.log(numberResult); // 1

const stringResult = transformBasedOnParameter(1, "str");
console.log(stringResult); // "1"

const booleanResult = transformBasedOnParameter(1, "bool");
console.log(booleanResult); // true

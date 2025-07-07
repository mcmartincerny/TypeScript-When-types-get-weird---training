# TypeScript: When Types Get Weird 🧩

## Training Overview 📚

> **Target Audience:** 👨‍💻 Developers with a few months of TypeScript experience + Senior developers  
> **Goal:** 🎯 Learn what NOT to do and practical solutions for complex typing scenarios

---

## Training Structure 🏗️

All examples use a **Messenger app** 💬 context to demonstrate concepts in a practical way.

### 1. THE DANGER OF ANY ⚠️

❓ **Problem:**   
Using `any` everywhere kills type safety and leads to runtime errors

💡 **Solution:**  
Proper typing strategies and gradual migration from `any`

---

### 2. TYPE ASSERTIONS & UNION TYPES 🔄

❓ **Problem:**   
Using "as" assertions for different message types (text, image, video) bypasses type checking

💡 **Solution:**  
Discriminated unions and type guard functions for safe type narrowing

---

### 3. TYPING COMPLEX OBJECTS 🧩

❓ **Problem:**   
Complex nested objects, dynamic keys, mixed types

💡 **Solution:**  
Index signatures, mapped types, and utility types

---

### 4. UTILITY TYPES FOR MESSAGE DATA 🛠️

❓ **Problem:**   
Duplicate types for different message states (draft vs sent)

💡 **Solution:**  
Using `Omit<T, K>`, `Pick<T, K>`, and `Partial<T>` to create derived types

---

### 5. PARSING JSON FROM API RESPONSES 📡

❓ **Problem:**   
Fetching message data and parsing JSON as any loses type safety

💡 **Solution:**  
Using Paste JSON as Code to generate proper message interfaces

---

### 6. RUNTIME TYPE VALIDATION ✅

❓ **Problem:**   
API responses might sometimes not match expected message TypeScript types

💡 **Solution:**  
Using superstruct to validate message data at runtime

---

### 7. GENERIC FUNCTIONS 🧰

❓ **Problem:**   
Functions that work with multiple types lack type safety

💡 **Solution:**  
Introduction to generics and type parameters for type-safe functions

---

### 8. FUNCTION OVERLOADS 🔀

❓ **Problem:**   
Send message function with different parameter/return type combinations (text, image, video)

💡 **Solution:**  
Proper function overload declarations

---

### 9. ADVANCED: CONDITIONAL TYPES IN REACT ⚛️

❓ **Problem:**   
Message input component where onChange type depends on input type prop

💡 **Solution:**  
Conditional types with React component (date/text/number example)

---

## Teaching Methodology 📝

Each section follows a consistent pattern:

1. ❌ Show the **WRONG** way (common anti-patterns)
2. ⚠️ Explain **WHY** it's problematic
3. ✅ Demonstrate the **RIGHT** way (best practices)

## Code Examples 💻

- 📄 Each file contains about 100-200 lines of code with messaging app examples
- 🔍 Examples are kept as simple as possible while demonstrating the concept
- 🌟 Code is focused on practical, real-world scenarios 
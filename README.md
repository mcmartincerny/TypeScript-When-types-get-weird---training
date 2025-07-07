# TypeScript: When Types Get Weird - Training

A practical training course on advanced TypeScript patterns and solutions for complex typing scenarios.

## Overview

This 20-minute training is designed for developers who have been using TypeScript for a few months but still encounter challenges with complex typing scenarios. It's also valuable for senior developers looking to deepen their TypeScript knowledge.

The training focuses on practical examples using a messaging app context to demonstrate common TypeScript challenges and their solutions.

## Target Audience

- Developers with a few months of TypeScript experience
- Senior developers who want to improve their TypeScript skills
- Teams transitioning from JavaScript to TypeScript

## Training Structure

Most sections follow a consistent pattern:
1. Show the WRONG way (common anti-patterns)
2. Explain WHY it's problematic
3. Demonstrate the RIGHT way (best practices)

## Topics Covered

1. **THE DANGER OF ANY**
   - Problem: Using `any` everywhere kills type safety and leads to runtime errors
   - Solution: Proper typing strategies and gradual migration from `any`

2. **TYPE ASSERTIONS & UNION TYPES**
   - Problem: Using "as" assertions for different message types bypasses type checking
   - Solution: Discriminated unions and type guard functions for safe type narrowing

3. **TYPING COMPLEX OBJECTS**
   - Problem: Complex nested objects, dynamic keys, mixed types
   - Solution: Index signatures, mapped types, and utility types

4. **UTILITY TYPES FOR MESSAGE DATA**
   - Problem: Duplicate types for different message states (draft vs sent)
   - Solution: Using Omit<T, K>, Pick<T, K>, and Partial<T> to create derived types

5. **PARSING JSON FROM API RESPONSES**
   - Problem: Fetching message data and parsing JSON as any loses type safety
   - Solution: Using Paste JSON as Code to generate proper message interfaces

6. **RUNTIME TYPE VALIDATION**
   - Problem: API responses might sometimes not match expected TypeScript types
   - Solution: Using superstruct to validate message data at runtime

7. **GENERIC FUNCTIONS**
   - Problem: Functions that work with multiple types lack type safety
   - Solution: Introduction to generics and type parameters for type-safe functions

8. **FUNCTION OVERLOADS**
   - Problem: Send message function with different parameter/return type combinations
   - Solution: Proper function overload declarations

9. **ADVANCED: CONDITIONAL TYPES IN REACT**
   - Problem: Message input component where onChange type depends on input type prop
   - Solution: Conditional types with React component (date/text/number example)

## How to Use This Repository

Each lecture is contained in its own file in the `lectures` directory. The files are numbered according to the lecture order.

To get the most out of this training:
1. Read through each file in order
2. Pay attention to the comments that explain the problems and solutions
3. Try to modify the examples to see how TypeScript responds
4. Apply the patterns to your own code

## Prerequisites

- Basic knowledge of TypeScript
- Understanding of JavaScript fundamentals
- Familiarity with React (for lecture 9)

## Setup

```bash
# Install dependencies
npm install
```

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Superstruct Documentation](https://docs.superstructjs.org/) (for runtime validation)

## License

MIT

---

Created by Martin Černý for training purposes. 
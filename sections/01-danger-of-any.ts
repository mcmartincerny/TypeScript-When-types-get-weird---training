// THE DANGER OF ANY
// ---------------

//! PROBLEM: Using 'any' everywhere kills type safety

// Message processing function with 'any' type
function processMessage(message: any) {
  // No type checking, IDE can't help with autocomplete
  console.log(`From: ${message.sender}, Message: ${message.text}`);
  
  // Runtime error if message.timestamp is undefined
  const minutesAgo = (Date.now() - message.timestamp) / 60000;
  console.log(`Sent ${Math.round(minutesAgo)} minutes ago`);
  
  // Typo in property name - no warning from TypeScript
  if (message.isImportent) { // Should be "isImportant"
    console.log("This message is marked as important!");
  }
  
  // Wrong assumption about data structure - runtime error
  message.recipients.forEach((user: any) => {
    console.log(`Delivered to: ${user.name}`);
  });
}

// These will cause runtime errors but TypeScript won't warn us
processMessage({ sender: "Alice", text: "Hello!" }); // Missing timestamp and recipients
processMessage({ sender: "Bob", text: "Hi!", timestamp: "yesterday" }); // timestamp is string, not number
processMessage({ sender: "Charlie", text: "Hey!", timestamp: Date.now(), isImportent: true }); // Typo in property


//! SOLUTION: Proper typing

// Define proper interfaces
interface IncommingMessage {
  sender: string;
  text: string;
  timestamp: number;
  isImportant?: boolean;
  recipients: { id: string; name: string }[];
}

// Same function with proper typing
function processMessageSafe(message: IncommingMessage) {
  console.log(`From: ${message.sender}, Message: ${message.text}`);
  
  // TypeScript ensures timestamp exists and is a number
  const minutesAgo = (Date.now() - message.timestamp) / 60000;
  console.log(`Sent ${Math.round(minutesAgo)} minutes ago`);
  
  // TypeScript catches the typo during development
  if (message.isImportant) {
    console.log("This message is marked as important!");
  }
  
  // TypeScript ensures recipients exists and has the right structure
  message.recipients.forEach(user => {
    console.log(`Delivered to: ${user.name}`);
  });
}

// TypeScript will show errors for all these at compile time
// processMessageSafe({ sender: "Alice", text: "Hello!" }); // Error: missing properties
// processMessageSafe({ sender: "Bob", text: "Hi!", timestamp: "yesterday" }); // Error: wrong type
// processMessageSafe({ sender: "Charlie", text: "Hey!", timestamp: Date.now(), isImportent: true }); // Error: typo 
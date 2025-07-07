// TYPING COMPLEX OBJECTS
// -----------------

//! PROBLEM: Complex nested objects with dynamic keys

// Basic message type
interface BasicMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

// Bad approach: Using any for complex nested structures
interface MessageWithReactions_Bad {
  message: BasicMessage;
  // Using any for complex nested structure with dynamic keys
  reactions: any;
}

// Example usage with the bad approach
function displayReactions_Bad(
  messageWithReactions: MessageWithReactions_Bad
): string {
  const { reactions } = messageWithReactions;

  // No type safety! These could all be undefined or wrong types
  const thumbsUpCount = reactions["👍"]?.count;
  const heartCount = reactions["❤️"]?.users?.length;

  // No autocomplete for user properties
  const reactorName = reactions["😊"]?.users[0]?.name;

  // No error if we try to access non-existent properties
  const nonExistentProp = reactions["🎉"]?.users[0]?.someNonExistentProperty;

  return `Reactions: ${thumbsUpCount} 👍, ${heartCount} ❤️, First reactor: ${reactorName}`;
}

// Sample data that would cause runtime errors
const badReactions = {
  message: {
    id: "123",
    sender: "Alice",
    text: "Hello everyone!",
    timestamp: Date.now(),
  },
  reactions: {
    "👍": { count: 5 }, // Missing users array
    "❤️": { users: [{ id: "user1" }] }, // Missing name property
    // "😊" is completely missing
  },
};

//! SOLUTION: Index signatures and recursive types

// User type
interface User {
  id: string;
  name: string;
}

// Reaction type with proper structure
interface Reaction {
  count: number;
  users: User[];
}

// Properly typed message with reactions
interface MessageWithReactions {
  message: BasicMessage;
  // use index signature for dynamic keys
  reactions: { [emoji: string]: Reaction };
}

// Type-safe function to display reactions
function displayReactions(messageWithReactions: MessageWithReactions): string {
  const { reactions } = messageWithReactions;

  // TypeScript knows the structure of reactions
  const thumbsUp = reactions["👍"];
  const thumbsUpCount = thumbsUp?.count ?? 0;

  const heart = reactions["❤️"];
  const heartCount = heart?.users.length ?? 0;

  // Safe access with proper typing
  const firstReactor = reactions["😊"]?.users[0]?.name ?? "No one";

  return `Reactions: ${thumbsUpCount} 👍, ${heartCount} ❤️, First reactor: ${firstReactor}`;
}

















//! A few example of how to create correct types for complex nested objects

//! Example 1: Recipient with pattern user-1, user-2, etc. or bot-1, bot-2, etc.

type SmallMessage = {
  message: string;
  from: string;
};

type UserKey = `user-${string}`;
type BotKey = `bot-${string}`;

type MessageRecipients = {
  [key: UserKey]: SmallMessage;
  [key: BotKey]: SmallMessage;
};

const messageRecipients: MessageRecipients = {
  "user-42": {
    message: "How can I help you?",
    from: "bot-90",
  },
  "bot-90": {
    message: "Can you send me the report?",
    from: "user-42",
  },
  // wrong keys:
  //   "system-1": {
  //     message: "Hello",
  //     from: "user-42",
  //   },
  //   "25": {
  //     message: "Hello",
  //     from: "user-42",
  //   },
};

//! Example 2: Nested paths with dot notation

// Type for accessing nested object properties with dot notation
type DotPaths<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? DotPaths<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

const settings = {
  notifications: {
    enabled: true,
    sound: "chime",
    desktop: false,
    situations: {
      work: {
        enabled: true,
        volume: 0.5,
      },
      home: {
        enabled: false,
        volume: 0.2,
      },
    },
  },
  privacy: {
    readReceipts: true,
    lastSeen: false,
  },
} as const;

type MessagePath = DotPaths<typeof settings>;

// Type-safe way to get/set deeply nested properties
function getSetting(path: MessagePath) {
  // Split the path and access nested properties
  const parts = path.split(".");
  let result: any = settings;

  for (const part of parts) {
    result = result[part];
  }

  return result;
}

// Usage
const soundSetting = getSetting("notifications.sound"); // Type-safe!
// const invalidSetting = getSetting("invalid.path"); // Error!

//! Example 3: Record with specific keys

// Allowed message status values
type MessageStatus = "sent" | "delivered" | "read" | "failed";

// Message status tracking with specific keys
type MessageStatusTracker = Record<MessageStatus, number>;

// Usage
const statusCounts: MessageStatusTracker = {
  sent: 5,
  delivered: 3,
  read: 2,
  failed: 1,
  // If you try to add another status, TypeScript will error:
//   unknown: 4 // Error!
};

//! Example 4: Mapped types for permissions

type Permission = "read" | "write" | "delete";
type Resource = "messages" | "contacts" | "settings";

// Create a type that maps all combinations of resources and permissions
type ResourcePermissions = {
  [R in Resource]: {
    [P in Permission]: boolean;
  };
};

// Usage
const userPermissions: ResourcePermissions = {
  messages: { read: true, write: true, delete: false },
  contacts: { read: true, write: false, delete: false },
  settings: { read: true, write: true, delete: true },
};

// Type-safe access
const canDeleteMessages = userPermissions.messages.delete; // false

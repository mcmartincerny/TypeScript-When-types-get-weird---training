// UTILITY TYPES FOR MESSAGE DATA
// --------------------------

export interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    metadata: {
        edited: boolean;
        replies: {
            count: number;
            messages: string[];
        };
    };
}

//! PROBLEM: Duplicate types with small differences

// Bad approach: Duplicating types
// Almost identical, just without id
interface DraftMessage_Bad {
  sender: string;
  text: string;
  timestamp: number;
  metadata: {
    edited: boolean;
    replies: {
      count: number;
      messages: string[];
    };
  };
}

// Problems:
// 1. Duplication of fields
// 2. If SentMessage changes, we need to update DraftMessage_Bad too
// 3. Easy to miss fields or make typos


//! SOLUTION: Using utility types

//! Example 1: Omit for draft messages

// Create DraftMessage by omitting the id field
type DraftMessage = Omit<Message, 'id'>;

// Usage
function createMessage(draft: DraftMessage): Message {
  return {
    ...draft,
    id: Math.random().toString(36) // Add the missing id
  };
}

//! Example 2: Partial for sanitization

type PartialDraftMessage = Partial<DraftMessage>;

// Function that sanitizes only provided fields
function getSanitizedMessageParts(message: PartialDraftMessage): PartialDraftMessage {
  const result: PartialDraftMessage = {};
  
  // Only sanitize text if it exists
  if (message.text !== undefined) {
    result.text = sanitizeText(message.text);
  }
  
  // Only sanitize metadata.replies.messages if they exist
  if (message.metadata?.replies?.messages !== undefined) {
    result.metadata = {
      ...message.metadata,
      replies: {
        ...message.metadata.replies,
        messages: message.metadata.replies.messages.map(sanitizeText)
      }
    };
  }
  
  return result;
}

function sanitizeText(text: string): string {
  return text.replace(/badWord/gi, '***');
}


//! Example 3: Pick for anonymization

type AnonymizedMessage = Pick<Message, 'text' | 'timestamp' | 'metadata'>;

// Function to anonymize a message by removing sender info
function anonymizeMessage(message: Message): AnonymizedMessage {
  // Pick only the fields we want to keep
  return {
    text: message.text,
    timestamp: message.timestamp,
    metadata: message.metadata
  };
}

// Usage
const message: Message = {
  id: "123",
  sender: "Alice",
  text: "Hello everyone!",
  timestamp: Date.now(),
  metadata: {
    edited: false,
    replies: {
      count: 0,
      messages: []
    }
  }
};

const anonymized = anonymizeMessage(message);
// anonymized.sender // Error: Property 'sender' does not exist 
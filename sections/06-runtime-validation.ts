// RUNTIME TYPE VALIDATION
// ---------------------

//! PROBLEM: API responses might not match expected TypeScript types

// We have our TypeScript interfaces from the previous example
interface Message {
  id: string;
  sender: string;
  text?: string;
  timestamp: number;
  reactions?: { [emoji: string]: number };
  image?: {
    url: string;
    width: number;
    height: number;
    caption: string;
  };
  video?: {
    url: string;
    duration: number;
    thumbnail: string;
    title: string;
  };
}

// But the API might return unexpected data that doesn't match our types
async function fetchMessage_Bad(messageId: string): Promise<Message> {
  const response = await fetch(`/api/messages/${messageId}`);
  const data = await response.json();

  // TypeScript believes this is a valid Message, but it might not be!
  // For example, timestamp could be a string instead of a number
  return data as Message;
}

// This function assumes the data matches our types, but could fail at runtime
function processMessage_Bad(message: Message) {
  // If timestamp is actually a string, this will produce unexpected results
  const minutesAgo = Math.floor((Date.now() - message.timestamp) / 60000);
  console.log(`Sent ${minutesAgo} minutes ago`);

  // If reactions is malformed, this could cause runtime errors
  if (message.reactions) {
    const reactionCount = Object.values(message.reactions).reduce(
      (a, b) => a + b,
      0
    );
    console.log(`Reactions: ${reactionCount}`);
  }
}

async function fetchAndProcessMessage_Bad() {
  const message = await fetchMessage_Bad("msg-123");
  processMessage_Bad(message);
}

//! SOLUTION: Runtime validation with Superstruct

import {
  assert,
  object,
  string,
  number,
  optional,
  record,
  Infer,
  is,
  union,
  array,
} from "superstruct";

// Define the schema for validation
const ImageSchema = object({
  url: string(),
  width: number(),
  height: number(),
  caption: string(),
});

const VideoSchema = object({
  url: string(),
  duration: number(),
  thumbnail: string(),
  title: string(),
});

const MessageSchema = object({
  id: string(),
  sender: string(),
  text: optional(string()),
  timestamp: number(),
  reactions: optional(record(string(), number())),
  image: optional(ImageSchema),
  video: optional(VideoSchema),
});

// Infer TypeScript type from the schema
type ValidatedMessage = Infer<typeof MessageSchema>;

// Fetch and validate at runtime
async function fetchMessage(messageId: string): Promise<ValidatedMessage> {
  const response = await fetch(`/api/messages/${messageId}`);
  const data = await response.json();

  assert(data, MessageSchema);
  return data;
}

// Now this function is guaranteed to receive valid data
function processMessage(message: ValidatedMessage) {
  // We can safely use the data knowing it matches our schema
  const minutesAgo = Math.floor((Date.now() - message.timestamp) / 60000);
  console.log(`Sent ${minutesAgo} minutes ago`);

  if (message.reactions) {
    const reactionCount = Object.values(message.reactions).reduce(
      (a, b) => a + b,
      0
    );
    console.log(`Reactions: ${reactionCount}`);
  }
}

async function fetchAndProcessMessage() {
  const message = await fetchMessage("msg-123");
  processMessage(message);
}

//! We can even use superstruct in condition to check what data did we got

const FriendRequestSchema = object({
  id: string(),
  sender: string(),
  recipient: string(),
  status: string(),
});

type FriendRequest = Infer<typeof FriendRequestSchema>;

const NewMessageSchema = object({
  id: string(),
  sender: string(),
  text: string(),
  timestamp: number(),
});

type NewMessage = Infer<typeof NewMessageSchema>;

const ApplicationUpdateSchema = object({
  newVersion: string(),
  releaseNotes: string(),
  downloadLink: string(),
});

type ApplicationUpdate = Infer<typeof ApplicationUpdateSchema>;

const NotificationSchema = union([
  FriendRequestSchema,
  NewMessageSchema,
  ApplicationUpdateSchema,
]);

type Notification = Infer<typeof NotificationSchema>;

async function getLastNotification() {
  const response = await fetch("/api/notifications/last");
  const data = await response.json();
  assert(data, NotificationSchema);
  return data;
}

async function displayLastNotification() {
  const notification = await getLastNotification();
  if (is(notification, FriendRequestSchema)) {
    console.log("Friend request received:", notification);
  } else if (is(notification, NewMessageSchema)) {
    console.log("New message:", notification);
  } else if (is(notification, ApplicationUpdateSchema)) {
    console.log("Application update:", notification);
  } else {
    throw new Error(
      "This can never happen, because we already asserted that it is one of the types"
    );
  }
}

//! Real example of how we use superstruct in Arnold to validate ChatGPT JSON responses

const ChatGPTResponseDataType = object({
  themes: array(
    object({
      summary: string(),
      answerIds: array(number()),
    })
  ),
});

async () => {
    /*
    ...
    ...
    ...
    */

  const response = await getChatCompletions(messages);

    /*
    ...
    ...
    ...
    */

  const responseText = response.choices![0].message!.content!;

  const chatGPTResponse = JSON.parse(responseText);
  // assert that the JSON response is in the correct format
  assert(chatGPTResponse, ChatGPTResponseDataType);

    /*
    ...
    ...
    ...
    */
};





// fake stuff so typescript is happy
function getChatCompletions(messages: any) {
  return Promise.resolve({
    choices: [{ message: { content: "Hello, world!" } }],
  });
}

const messages = [
  { role: "user", content: "What is the capital of France?" },
];

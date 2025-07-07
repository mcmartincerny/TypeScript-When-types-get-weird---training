// TYPE ASSERTIONS & UNION TYPES
// ---------------------------

//! PROBLEM: Using "as" assertions bypasses type checking

// Bad approach: One big interface with optional properties
interface IncomingMessage {
  id: string;
  sender: string;
  timestamp: number;
  // Message content properties
  textContent?: string;
  // Image message properties
  imageUrl?: string;
  width?: number;
  height?: number;
  // Video message properties
  videoUrl?: string;
  duration?: number;
}

interface ImageStuff {
  imageUrl: string;
  width: number;
  height: number;
}

interface VideoStuff {
  videoUrl: string;
  duration: number;
}

// Function to create notification message
function createNotification(message: IncomingMessage): string {
  // Using type assertions to "assume" what kind of message it is
  if (message.textContent) {
    return `${message.sender} texted "${message.textContent}"`;
  } else if (message.imageUrl) {
    const image = message as ImageStuff;
    // Unsafe! Width/height might be undefined
    return `${
      message.sender
    } sent an image (${image.width.toString()}x${image.height.toString()})`;
  } else if (message.videoUrl) {
    const video = message as VideoStuff;
    // Unsafe! Duration might be undefined
    const minutes = Math.floor(video.duration / 60);
    const seconds = video.duration % 60;
    return `${message.sender} sent a video (${minutes}:${seconds})`;
  }

  // Default fallback
  return `${message.sender} sent a message`;
}

// These will cause runtime errors but TypeScript won't warn us
const textMessage = {
  id: "1",
  sender: "Alice",
  timestamp: Date.now(),
  textContent: "How are you doing?",
};
const imageMessage = {
  id: "2",
  sender: "Bob",
  timestamp: Date.now(),
  imageUrl: "photo.jpg",
}; // Missing width/height
const videoMessage = {
  id: "3",
  sender: "Charlie",
  timestamp: Date.now(),
  videoUrl: "video.mp4",
}; // Missing duration

//! SOLUTION: Property-based type guards

// Define specific message types without a type discriminator
export interface BaseMessage {
  id: string;
  sender: string;
  timestamp: number;
}

interface TextMessage extends BaseMessage {
  text: string;
}

interface ImageMessage extends BaseMessage {
  imageUrl: string;
  width: number;
  height: number;
}

interface VideoMessage extends BaseMessage {
  videoUrl: string;
  duration: number;
}

// Union type combines all message types
type Message = TextMessage | ImageMessage | VideoMessage;

// Property-based type guards
function isTextMessage(message: Message): message is TextMessage {
  return "text" in message;
}

function isImageMessage(message: Message): message is ImageMessage {
  return (
    "imageUrl" in message &&
    typeof message.imageUrl === "string" &&
    "width" in message &&
    typeof message.width === "number" &&
    "height" in message &&
    typeof message.height === "number"
  );
}

function isVideoMessage(message: Message): message is VideoMessage {
  return (
    "videoUrl" in message &&
    typeof message.videoUrl === "string" &&
    "duration" in message &&
    typeof message.duration === "number"
  );
}

// Improved notification function with proper type checking
function createSafeNotification(message: Message): string {
  if (isTextMessage(message)) {
    return `${message.sender} texted "${message.text}"`;
  } else if (isImageMessage(message)) {
    // Safe! TypeScript knows width/height exist
    return `${message.sender} sent an image (${message.width}x${message.height})`;
  } else if (isVideoMessage(message)) {
    // Safe! TypeScript knows duration exists
    const minutes = Math.floor(message.duration / 60);
    const seconds = message.duration % 60;
    return `${message.sender} sent a video (${minutes}:${seconds})`;
  }

  // This code is unreachable with proper type guards
  throw new Error("Unknown message type");
}

//! Better solution: Discriminated unions and type guards

interface BetterBaseMessage {
  type: string;
}

interface TextMessage extends BetterBaseMessage {
  type: "text";
  text: string;
}

interface ImageMessage extends BetterBaseMessage {
  type: "image";
  imageUrl: string;
}

interface VideoMessage extends BetterBaseMessage {
  type: "video";
  videoUrl: string;
}

type BetterMessage = TextMessage | ImageMessage | VideoMessage;

function betterIsTextMessage(message: BetterMessage): message is TextMessage {
  return message.type === "text";
}

function betterIsImageMessage(message: BetterMessage): message is ImageMessage {
  return message.type === "image";
}

function betterIsVideoMessage(message: BetterMessage): message is VideoMessage {
  return message.type === "video";
}

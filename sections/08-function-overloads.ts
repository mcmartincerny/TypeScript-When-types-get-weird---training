// FUNCTION OVERLOADS
// -----------------

//! PROBLEM: Send message function with different parameter/return type combinations

// Common message properties
interface BaseMessage {
  recipient: string;
}

// Different message types
interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
}

interface ImageMessage extends BaseMessage {
  type: "image";
  imageUrl: string;
  caption?: string;
}

interface VideoMessage extends BaseMessage {
  type: "video";
  videoUrl: string;
  duration: number;
  thumbnail?: string;
}

// Union type for all message types
type Message = TextMessage | ImageMessage | VideoMessage;

// Return types
interface BaseResponse {
  id: string;
  timestamp: number;
  deliveryStatus: "sent" | "failed";
}

interface TextResponse extends BaseResponse {
  type: "text";
  content: {
    text: string;
  };
}

interface ImageResponse extends BaseResponse {
  type: "image";
  content: {
    imageUrl: string;
    uploadStatus: "uploading" | "complete" | "failed";
    progress?: number;
  };
}

interface VideoResponse extends BaseResponse {
  type: "video";
  content: {
    videoUrl: string;
    processingStatus: "processing" | "complete" | "failed";
    thumbnail?: string;
  };
}

// BAD APPROACH: Using a single function with type checking
function sendMessage_Bad(
  message: Message
): TextResponse | ImageResponse | VideoResponse {
  const id = generateId();
  const timestamp = Date.now();

  fetch("htts://api.example.com/sendMessage", {
    method: "POST",
    body: JSON.stringify(message),
  });

  // Type checking based on the message type
  if (message.type === "text") {
    return {
      type: "text",
      id,
      timestamp,
      deliveryStatus: "sent",
      content: {
        text: message.text,
      },
    };
  } else if (message.type === "image") {
    return {
      type: "image",
      id,
      timestamp,
      deliveryStatus: "sent",
      content: {
        imageUrl: message.imageUrl,
        uploadStatus: "complete",
        progress: 100,
      },
    };
  } else if (message.type === "video") {
    return {
      type: "video",
      id,
      timestamp,
      deliveryStatus: "sent",
      content: {
        videoUrl: message.videoUrl,
        processingStatus: "processing",
        thumbnail: message.thumbnail,
      },
    };
  }

  // TypeScript doesn't know we've handled all cases
  // We need this to make the compiler happy
  throw new Error("Unsupported message type");
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Usage of the bad approach
// Problems:
// 1. Return type is a union - TypeScript doesn't know which one you'll get back
// 2. Need to check the type of the response to access specific properties
// 3. No compile-time guarantee that you're handling all cases

const textMessage: TextMessage = {
  recipient: "user123",
  type: "text",
  text: "Hello there!",
};

const textResult = sendMessage_Bad(textMessage);
// Need to check the type before accessing specific properties
if (textResult.type === "text") {
  console.log(textResult.content.text);
}

const imageMessage: ImageMessage = {
  recipient: "user123",
  type: "image",
  imageUrl: "image.jpg",
  caption: "My vacation",
};

const imageResult = sendMessage_Bad(imageMessage);
// Need to check again
if (imageResult.type === "image") {
  console.log(imageResult.content.uploadStatus);
}

//! SOLUTION: Using function overloads

// Function overload signatures - one parameter but different types
function sendMessage(message: TextMessage): TextResponse;
function sendMessage(message: ImageMessage): ImageResponse;
function sendMessage(message: VideoMessage): VideoResponse;

// Implementation
function sendMessage(
  message: Message
): TextResponse | ImageResponse | VideoResponse {
  const id = generateId();
  const timestamp = Date.now();

  fetch("htts://api.example.com/sendMessage", {
    method: "POST",
    body: JSON.stringify(message),
  });

  switch (message.type) {
    case "text":
      return {
        id,
        timestamp,
        deliveryStatus: "sent",
        type: "text",
        content: {
          text: message.text,
        },
      };

    case "image":
      return {
        id,
        timestamp,
        deliveryStatus: "sent",
        type: "image",
        content: {
          imageUrl: message.imageUrl,
          uploadStatus: "complete",
          progress: 100,
        },
      };

    case "video":
      return {
        id,
        timestamp,
        deliveryStatus: "sent",
        type: "video",
        content: {
          videoUrl: message.videoUrl,
          processingStatus: "processing",
          thumbnail: message.thumbnail,
        },
      };
  }
}

// Usage of the good approach with function overloads
// Benefits:
// 1. TypeScript knows exactly which return type you'll get based on the input
// 2. No need to check the type of the response
// 3. Autocomplete works correctly for the specific return type

// Text message
const text = sendMessage({
  recipient: "user123",
  type: "text",
  text: "Hello there!",
});
// TypeScript knows this is TextResponse
console.log(text.content.text);

// Image message
const image = sendMessage({
  recipient: "user123",
  type: "image",
  imageUrl: "image.jpg",
  caption: "My vacation",
});
// TypeScript knows this is ImageResponse
console.log(image.content.uploadStatus);

// Video message
const video = sendMessage({
  recipient: "user123",
  type: "video",
  videoUrl: "video.mp4",
  duration: 120,
});
// TypeScript knows this is VideoResponse
console.log(video.content.processingStatus);

// With the overloads, TypeScript gives you the exact return type
// without needing to check the type property

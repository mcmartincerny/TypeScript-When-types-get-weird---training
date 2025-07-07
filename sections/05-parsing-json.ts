// PARSING JSON FROM API RESPONSES
// ----------------------------

//! PROBLEM: Fetching message data and parsing JSON as any loses type safety

// Bad approach: Using 'any' for API responses
async function fetchConversation_Bad(conversationId: string): Promise<any> {
  const response = await fetch(`/api/conversations/${conversationId}`);
  // Parsing JSON as 'any' - no type safety!
  const data = await response.json();
  return data;
}

// Using the 'any' typed data
async function displayConversation_Bad() {
  const data = await fetchConversation_Bad('conv-123');
  
  // No autocomplete, no type checking
  console.log(`Conversation: ${data.conversation.title}`);
  
  // Runtime errors if structure doesn't match expectations
  const unreadMessages = data.messages.filter((msg: any) => !msg.read);
  
  // No warning for accessing non-existent properties
  for (const message of data.messages) {
    if (message.text) {
      console.log(`${message.sender}: ${message.text}`);
    } else if (message.image) {
      // No type checking on nested properties
      console.log(`${message.sender} sent an image: ${message.image.caption}`);
    } else if (message.video) {
      // TypeScript doesn't know video has a title property
      console.log(`${message.sender} sent a video: ${message.video.title}`);
    }
    
    // This will cause runtime errors if reactions is undefined
    if (message.reactions) {
      const values: number[] = Object.values(message.reactions);
      const reactionCount = values.reduce((a: number, b: number) => a + b, 0);
      console.log(`Reactions: ${reactionCount}`);
    }
  }
}


//! SOLUTION: Using Paste JSON as Code to generate proper interfaces

// Generated interfaces using "Paste JSON as Code" extension

export interface ConversationResponse {
    conversation: Conversation;
    messages:     Message[];
    unreadCount:  number;
    lastActivity: number;
}

export interface Conversation {
    id:           string;
    title:        string;
    participants: Participant[];
}

export interface Participant {
    id:     string;
    name:   string;
    status: string;
}

export interface Message {
    id:         string;
    sender:     string;
    text?:      string;
    timestamp:  number;
    reactions?: Reactions;
    image?:     Image;
    video?:     Video;
}

export interface Image {
    url:     string;
    width:   number;
    height:  number;
    caption: string;
}

export interface Reactions {
    "\ud83d\udc4d"?: number;
    "\ud83d\udc4c"?: number;
    "\ud83d\ude18"?: number;
    "\ud83d\ude2d"?: number;
    "\ud83d\ude00"?: number;
    "\ud83d\ude35"?: number;
}

export interface Video {
    url:       string;
    duration:  number;
    thumbnail: string;
    title:     string;
}






// Properly typed fetch function
async function fetchConversation(conversationId: string): Promise<ConversationResponse> {
  const response = await fetch(`/api/conversations/${conversationId}`);
  // Parse JSON with proper typing
  const data = await response.json() as ConversationResponse;
  return data;
}

// IDENTICAL FUNCTION using the properly typed data
async function displayConversation() {
  const data = await fetchConversation('conv-123');
  
  // Autocomplete and type checking work!
  console.log(`Conversation: ${data.conversation.title}`);
  
  // TypeScript knows the structure of messages
  for (const message of data.messages) {
    // TypeScript helps with property checking
    if (message.text) {
      console.log(`${message.sender}: ${message.text}`);
    } else if (message.image) {
      // Autocomplete works for nested properties
      console.log(`${message.sender} sent an image: ${message.image.caption}`);
    } else if (message.video) {
      console.log(`${message.sender} sent a video: ${message.video.title}`);
    }
    
    // Safe access with optional chaining and nullish coalescing
    const reactionCount = message.reactions 
      ? Object.values(message.reactions).reduce((a, b) => a + b, 0)
      : 0;
    console.log(`Reactions: ${reactionCount}`);
  }
} 
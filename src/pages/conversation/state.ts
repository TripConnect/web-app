export type User = {
  id: string;
};

export type Conversation = {
  id: string;
};

// MUST have either correlationId or id
export type Message = {
  id: string;
  status: 'PENDING' | 'SENT';
  fromUser: User;
  content: string;
  sentTime: string; // ISO 8601
};

export type ScrollDirection = "up" | "down";
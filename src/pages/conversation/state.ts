export type User = {
    id: string;
};

export type Conversation = {
    id: string;
};

export type Message = {
    id: string;
    fromUser: User;
    content: string;
    createdAt: string; // ISO 8601
};

export type ScrollDirection = "up" | "down";
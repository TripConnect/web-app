export type User = {
    id: string;
    displayName: string;
    avatar: string;
}

export type ChatMessageModel = {
    id: string,
    conversationId: string,
    owner: User,
    content: string,
    createdAt: string,
}

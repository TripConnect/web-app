export type User = {
    id: string
}

export type Conversation = {
    id: string
}

export type Message = {
    content: string
    conversation: Conversation
    createdAt: string // ISO 8601
    fromUser: User
    id: string
}

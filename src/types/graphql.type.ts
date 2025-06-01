export namespace GraphQLModels {
    export type DateTime = string; // ISO 8601 string, e.g., "2025-06-01T12:00:00Z"

    export interface Token {
        accessToken?: string;
        refreshToken?: string;
    }

    export interface Self {
        id?: string;
        avatar?: string;
        displayName?: string;
        enabledTwofa?: boolean;
    }

    export interface AuthUser {
        token?: Token;
        userInfo?: Self;
    }

    export interface User {
        id?: string;
        avatar?: string;
        displayName?: string;
    }

    export enum ConversationType {
        GROUP = "GROUP",
        PRIVATE = "PRIVATE"
    }

    export interface Message {
        id?: string;
        content?: string;
        conversation?: Conversation;
        createdAt?: DateTime;
        fromUser?: User;
    }

    export interface Conversation {
        id?: string;
        createdAt?: DateTime;
        createdBy?: User;
        lastMessageAt?: DateTime;
        members?: User[];
        messages?: Message[];
        name?: string;
        type?: ConversationType;
    }

    export interface ResponseModel {
        status?: boolean;
    }

    export interface Settings {
        qrCode?: string;
        secret?: string;
    }

    // Input types for Mutation

    export interface CreateConversationInput {
        memberIds: string[];
        name: string;
        type: ConversationType;
    }

    export interface Enable2FAInput {
        otp: string;
        secret: string;
    }

    export interface SigninInput {
        otp?: string;
        password: string;
        username: string;
    }

    // Input types for Query

    export interface ConversationQueryInput {
        id: string;
    }

    export interface UserQueryInput {
        id: string;
    }

    export interface UsersQueryInput {
        pageNumber: number;
        pageSize: number;
        searchTerm: string;
    }

    export interface MessagesQueryArgs {
        messagePageNumber: number;
        messagePageSize: number;
    }
}

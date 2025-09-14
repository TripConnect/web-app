/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query GetLivestreamDetail($id: ID!) {\n        livestream(id: $id) {\n            id\n            hlsLink\n        }\n    }\n": typeof types.GetLivestreamDetailDocument,
    "\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signIn(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n": typeof types.SigninWithOtpDocument,
    "\n    query Me {\n        me {\n            enabledTwofa\n        }\n    }\n": typeof types.MeDocument,
    "\n    mutation Generate2FASecret {\n        generate2FASecret {\n            secret\n            qrCode\n        }\n    }\n": typeof types.Generate2FaSecretDocument,
    "\n    mutation Enable2FA($secret: String!, $otp: String!) {\n        enable2FA(secret: $secret, otp: $otp) {\n            success\n        }\n    }\n": typeof types.Enable2FaDocument,
    "\n    mutation CreateConversation($memberIds: [String!]!) {\n        createConversation(type: PRIVATE, memberIds: $memberIds) {\n            id\n        }\n    }\n": typeof types.CreateConversationDocument,
    "\n    query User($id: ID!) {\n        user(id: $id) {\n            id\n            avatar\n            displayName\n        }\n    }\n": typeof types.UserDocument,
    "\n    query InitUiQuery($id: ID!) {\n        conversation(id: $id) {\n            name\n            type\n        }\n    }\n": typeof types.InitUiQueryDocument,
    "\n    query FetchMessageQuery($id: ID!, $before: DateTime, $after: DateTime, $limit: Int!) {\n        conversation(id: $id) {\n            messages(messageBefore: $before, messageAfter: $after, messageLimit: $limit) {\n                id\n                content\n                createdAt\n                sentTime\n                fromUser {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    }\n": typeof types.FetchMessageQueryDocument,
    "\n    mutation SendMessageMutation($conversationId: ID!, $content: String!) {\n        sendMessage(conversation_id: $conversationId, content: $content) {\n            correlationId\n        }\n    }\n": typeof types.SendMessageMutationDocument,
    "\n    query GetActiveLives($pageNumber: Int!, $pageSize: Int!, $status: String) {\n        livestreams(pageNumber: $pageNumber, pageSize: $pageSize, status: $status) {\n            id\n            hlsLink\n        }\n    }\n": typeof types.GetActiveLivesDocument,
    "\n    mutation CreateLives {\n        createLivestream {\n            id\n            hlsLink\n        }\n    }\n": typeof types.CreateLivesDocument,
    "\n    mutation SignIn($username: String!, $password: String!) {\n        signIn(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n        }\n    }\n": typeof types.SignInDocument,
    "\n        mutation SignUp($username: String!, $password: String!, $displayName: String!) {\n            signUp(username: $username, password: $password, displayName: $displayName) {\n                userInfo {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    ": typeof types.SignUpDocument,
    "\n    query Users($searchTerm: String!) {\n        users(searchTerm: $searchTerm) {\n            id\n            displayName\n            avatar\n        }\n    }\n": typeof types.UsersDocument,
    "\n    mutation SignOut {\n        signOut {\n            success\n        }\n    }\n": typeof types.SignOutDocument,
};
const documents: Documents = {
    "\n    query GetLivestreamDetail($id: ID!) {\n        livestream(id: $id) {\n            id\n            hlsLink\n        }\n    }\n": types.GetLivestreamDetailDocument,
    "\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signIn(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n": types.SigninWithOtpDocument,
    "\n    query Me {\n        me {\n            enabledTwofa\n        }\n    }\n": types.MeDocument,
    "\n    mutation Generate2FASecret {\n        generate2FASecret {\n            secret\n            qrCode\n        }\n    }\n": types.Generate2FaSecretDocument,
    "\n    mutation Enable2FA($secret: String!, $otp: String!) {\n        enable2FA(secret: $secret, otp: $otp) {\n            success\n        }\n    }\n": types.Enable2FaDocument,
    "\n    mutation CreateConversation($memberIds: [String!]!) {\n        createConversation(type: PRIVATE, memberIds: $memberIds) {\n            id\n        }\n    }\n": types.CreateConversationDocument,
    "\n    query User($id: ID!) {\n        user(id: $id) {\n            id\n            avatar\n            displayName\n        }\n    }\n": types.UserDocument,
    "\n    query InitUiQuery($id: ID!) {\n        conversation(id: $id) {\n            name\n            type\n        }\n    }\n": types.InitUiQueryDocument,
    "\n    query FetchMessageQuery($id: ID!, $before: DateTime, $after: DateTime, $limit: Int!) {\n        conversation(id: $id) {\n            messages(messageBefore: $before, messageAfter: $after, messageLimit: $limit) {\n                id\n                content\n                createdAt\n                sentTime\n                fromUser {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    }\n": types.FetchMessageQueryDocument,
    "\n    mutation SendMessageMutation($conversationId: ID!, $content: String!) {\n        sendMessage(conversation_id: $conversationId, content: $content) {\n            correlationId\n        }\n    }\n": types.SendMessageMutationDocument,
    "\n    query GetActiveLives($pageNumber: Int!, $pageSize: Int!, $status: String) {\n        livestreams(pageNumber: $pageNumber, pageSize: $pageSize, status: $status) {\n            id\n            hlsLink\n        }\n    }\n": types.GetActiveLivesDocument,
    "\n    mutation CreateLives {\n        createLivestream {\n            id\n            hlsLink\n        }\n    }\n": types.CreateLivesDocument,
    "\n    mutation SignIn($username: String!, $password: String!) {\n        signIn(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n        }\n    }\n": types.SignInDocument,
    "\n        mutation SignUp($username: String!, $password: String!, $displayName: String!) {\n            signUp(username: $username, password: $password, displayName: $displayName) {\n                userInfo {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    ": types.SignUpDocument,
    "\n    query Users($searchTerm: String!) {\n        users(searchTerm: $searchTerm) {\n            id\n            displayName\n            avatar\n        }\n    }\n": types.UsersDocument,
    "\n    mutation SignOut {\n        signOut {\n            success\n        }\n    }\n": types.SignOutDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetLivestreamDetail($id: ID!) {\n        livestream(id: $id) {\n            id\n            hlsLink\n        }\n    }\n"): (typeof documents)["\n    query GetLivestreamDetail($id: ID!) {\n        livestream(id: $id) {\n            id\n            hlsLink\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signIn(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signIn(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Me {\n        me {\n            enabledTwofa\n        }\n    }\n"): (typeof documents)["\n    query Me {\n        me {\n            enabledTwofa\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Generate2FASecret {\n        generate2FASecret {\n            secret\n            qrCode\n        }\n    }\n"): (typeof documents)["\n    mutation Generate2FASecret {\n        generate2FASecret {\n            secret\n            qrCode\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Enable2FA($secret: String!, $otp: String!) {\n        enable2FA(secret: $secret, otp: $otp) {\n            success\n        }\n    }\n"): (typeof documents)["\n    mutation Enable2FA($secret: String!, $otp: String!) {\n        enable2FA(secret: $secret, otp: $otp) {\n            success\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateConversation($memberIds: [String!]!) {\n        createConversation(type: PRIVATE, memberIds: $memberIds) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation CreateConversation($memberIds: [String!]!) {\n        createConversation(type: PRIVATE, memberIds: $memberIds) {\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query User($id: ID!) {\n        user(id: $id) {\n            id\n            avatar\n            displayName\n        }\n    }\n"): (typeof documents)["\n    query User($id: ID!) {\n        user(id: $id) {\n            id\n            avatar\n            displayName\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query InitUiQuery($id: ID!) {\n        conversation(id: $id) {\n            name\n            type\n        }\n    }\n"): (typeof documents)["\n    query InitUiQuery($id: ID!) {\n        conversation(id: $id) {\n            name\n            type\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query FetchMessageQuery($id: ID!, $before: DateTime, $after: DateTime, $limit: Int!) {\n        conversation(id: $id) {\n            messages(messageBefore: $before, messageAfter: $after, messageLimit: $limit) {\n                id\n                content\n                createdAt\n                sentTime\n                fromUser {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query FetchMessageQuery($id: ID!, $before: DateTime, $after: DateTime, $limit: Int!) {\n        conversation(id: $id) {\n            messages(messageBefore: $before, messageAfter: $after, messageLimit: $limit) {\n                id\n                content\n                createdAt\n                sentTime\n                fromUser {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SendMessageMutation($conversationId: ID!, $content: String!) {\n        sendMessage(conversation_id: $conversationId, content: $content) {\n            correlationId\n        }\n    }\n"): (typeof documents)["\n    mutation SendMessageMutation($conversationId: ID!, $content: String!) {\n        sendMessage(conversation_id: $conversationId, content: $content) {\n            correlationId\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetActiveLives($pageNumber: Int!, $pageSize: Int!, $status: String) {\n        livestreams(pageNumber: $pageNumber, pageSize: $pageSize, status: $status) {\n            id\n            hlsLink\n        }\n    }\n"): (typeof documents)["\n    query GetActiveLives($pageNumber: Int!, $pageSize: Int!, $status: String) {\n        livestreams(pageNumber: $pageNumber, pageSize: $pageSize, status: $status) {\n            id\n            hlsLink\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateLives {\n        createLivestream {\n            id\n            hlsLink\n        }\n    }\n"): (typeof documents)["\n    mutation CreateLives {\n        createLivestream {\n            id\n            hlsLink\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SignIn($username: String!, $password: String!) {\n        signIn(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation SignIn($username: String!, $password: String!) {\n        signIn(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation SignUp($username: String!, $password: String!, $displayName: String!) {\n            signUp(username: $username, password: $password, displayName: $displayName) {\n                userInfo {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    "): (typeof documents)["\n        mutation SignUp($username: String!, $password: String!, $displayName: String!) {\n            signUp(username: $username, password: $password, displayName: $displayName) {\n                userInfo {\n                    id\n                    displayName\n                    avatar\n                }\n            }\n        }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Users($searchTerm: String!) {\n        users(searchTerm: $searchTerm) {\n            id\n            displayName\n            avatar\n        }\n    }\n"): (typeof documents)["\n    query Users($searchTerm: String!) {\n        users(searchTerm: $searchTerm) {\n            id\n            displayName\n            avatar\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SignOut {\n        signOut {\n            success\n        }\n    }\n"): (typeof documents)["\n    mutation SignOut {\n        signOut {\n            success\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
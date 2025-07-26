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
    "\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signin(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n": typeof types.SigninWithOtpDocument,
    "\n    query Me {\n        me {\n            enabledTwofa\n        }\n    }\n": typeof types.MeDocument,
    "\n    mutation Generate2FASecret {\n        generate2FASecret {\n            secret\n            qrCode\n        }\n    }\n": typeof types.Generate2FaSecretDocument,
    "\n    mutation Enable2FA($secret: String!, $otp: String!) {\n        enable2FA(secret: $secret, otp: $otp) {\n            success\n        }\n    }\n": typeof types.Enable2FaDocument,
    "\n    mutation Signin($username: String!, $password: String!) {\n        signin(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n": typeof types.SigninDocument,
    "\n    mutation CreateConversation($memberIds: [String!]!) {\n        createConversation(type: PRIVATE, memberIds: $memberIds) {\n            id\n        }\n    }\n": typeof types.CreateConversationDocument,
    "\n    query User($id: ID!) {\n        user(id: $id) {\n            id\n            avatar\n            displayName\n        }\n    }\n": typeof types.UserDocument,
    "\n  query Users($searchTerm: String!) {\n    users(searchTerm: $searchTerm) {\n      id\n      displayName\n      avatar\n    }\n  }\n": typeof types.UsersDocument,
};
const documents: Documents = {
    "\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signin(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n": types.SigninWithOtpDocument,
    "\n    query Me {\n        me {\n            enabledTwofa\n        }\n    }\n": types.MeDocument,
    "\n    mutation Generate2FASecret {\n        generate2FASecret {\n            secret\n            qrCode\n        }\n    }\n": types.Generate2FaSecretDocument,
    "\n    mutation Enable2FA($secret: String!, $otp: String!) {\n        enable2FA(secret: $secret, otp: $otp) {\n            success\n        }\n    }\n": types.Enable2FaDocument,
    "\n    mutation Signin($username: String!, $password: String!) {\n        signin(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n": types.SigninDocument,
    "\n    mutation CreateConversation($memberIds: [String!]!) {\n        createConversation(type: PRIVATE, memberIds: $memberIds) {\n            id\n        }\n    }\n": types.CreateConversationDocument,
    "\n    query User($id: ID!) {\n        user(id: $id) {\n            id\n            avatar\n            displayName\n        }\n    }\n": types.UserDocument,
    "\n  query Users($searchTerm: String!) {\n    users(searchTerm: $searchTerm) {\n      id\n      displayName\n      avatar\n    }\n  }\n": types.UsersDocument,
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
export function graphql(source: "\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signin(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation SigninWithOTP($username: String!, $password: String!, $otp: String!) {\n        signin(username: $username, password: $password, otp: $otp) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n"];
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
export function graphql(source: "\n    mutation Signin($username: String!, $password: String!) {\n        signin(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation Signin($username: String!, $password: String!) {\n        signin(username: $username, password: $password) {\n            userInfo {\n                id\n                displayName\n                avatar\n            }\n            token {\n                accessToken\n                refreshToken\n            }\n        }\n    }\n"];
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
export function graphql(source: "\n  query Users($searchTerm: String!) {\n    users(searchTerm: $searchTerm) {\n      id\n      displayName\n      avatar\n    }\n  }\n"): (typeof documents)["\n  query Users($searchTerm: String!) {\n    users(searchTerm: $searchTerm) {\n      id\n      displayName\n      avatar\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
/* eslint-disable */
import {TypedDocumentNode as DocumentNode} from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AuthUser = {
  __typename?: 'AuthUser';
  token: Maybe<Token>;
  userInfo: Maybe<Self>;
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  createdBy: User;
  id: Scalars['ID']['output'];
  lastMessageAt: Maybe<Scalars['DateTime']['output']>;
  members: Array<User>;
  messages: Array<Message>;
  name: Scalars['String']['output'];
  type: ConversationType;
};


export type ConversationMembersArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type ConversationMessagesArgs = {
  messageAfter: InputMaybe<Scalars['DateTime']['input']>;
  messageBefore: InputMaybe<Scalars['DateTime']['input']>;
  messageLimit: Scalars['Int']['input'];
};

/** Type of conversation */
export enum ConversationType {
  Group = 'GROUP',
  Private = 'PRIVATE'
}

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  conversation: Conversation;
  createdAt: Scalars['DateTime']['output'];
  fromUser: User;
  id: Scalars['ID']['output'];
  sentTime: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createConversation: Conversation;
  enable2FA: ResponseModel;
  generate2FASecret: Settings;
  sendMessage: SendMessageAck;
  signIn: AuthUser;
  signUp: AuthUser;
};


export type MutationCreateConversationArgs = {
  memberIds: Array<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  type: ConversationType;
};


export type MutationEnable2FaArgs = {
  otp: Scalars['String']['input'];
  secret: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  conversation_id: Scalars['ID']['input'];
};


export type MutationSignInArgs = {
  otp?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  conversation: Conversation;
  me: Self;
  user: User;
  users: Array<User>;
};


export type QueryConversationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  pageNumber?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  searchTerm: Scalars['String']['input'];
};

export type ResponseModel = {
  __typename?: 'ResponseModel';
  success: Scalars['Boolean']['output'];
};

export type Self = {
  __typename?: 'Self';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  enabledTwofa: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
};

export type SendMessageAck = {
  __typename?: 'SendMessageAck';
  correlationId: Scalars['String']['output'];
};

export type Settings = {
  __typename?: 'Settings';
  qrCode: Scalars['String']['output'];
  secret: Scalars['String']['output'];
};

export type Token = {
  __typename?: 'Token';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type SigninWithOtpMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type SigninWithOtpMutation = {
  __typename?: 'Mutation',
  signIn: {
    __typename?: 'AuthUser',
    userInfo: { __typename?: 'Self', id: string, displayName: string, avatar: string } | null,
    token: { __typename?: 'Token', accessToken: string, refreshToken: string } | null
  }
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Self', enabledTwofa: boolean } };

export type Generate2FaSecretMutationVariables = Exact<{ [key: string]: never; }>;


export type Generate2FaSecretMutation = {
  __typename?: 'Mutation',
  generate2FASecret: { __typename?: 'Settings', secret: string, qrCode: string }
};

export type Enable2FaMutationVariables = Exact<{
  secret: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type Enable2FaMutation = {
  __typename?: 'Mutation',
  enable2FA: { __typename?: 'ResponseModel', success: boolean }
};

export type SignInMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = {
  __typename?: 'Mutation',
  signIn: {
    __typename?: 'AuthUser',
    userInfo: { __typename?: 'Self', id: string, displayName: string, avatar: string } | null
  }
};

export type CreateConversationMutationVariables = Exact<{
  memberIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CreateConversationMutation = {
  __typename?: 'Mutation',
  createConversation: { __typename?: 'Conversation', id: string }
};

export type UserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UserQuery = {
  __typename?: 'Query',
  user: { __typename?: 'User', id: string, avatar: string, displayName: string }
};

export type InitUiQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type InitUiQueryQuery = {
  __typename?: 'Query',
  conversation: { __typename?: 'Conversation', name: string, type: ConversationType }
};

export type FetchMessageQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  before: InputMaybe<Scalars['DateTime']['input']>;
  after: InputMaybe<Scalars['DateTime']['input']>;
  limit: Scalars['Int']['input'];
}>;


export type FetchMessageQueryQuery = {
  __typename?: 'Query',
  conversation: {
    __typename?: 'Conversation',
    messages: Array<{
      __typename?: 'Message',
      id: string,
      content: string,
      createdAt: any,
      sentTime: any,
      fromUser: { __typename?: 'User', id: string, displayName: string, avatar: string }
    }>
  }
};

export type SendMessageMutationMutationVariables = Exact<{
  conversationId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type SendMessageMutationMutation = {
  __typename?: 'Mutation',
  sendMessage: { __typename?: 'SendMessageAck', correlationId: string }
};

export type SignUpMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignUpMutation = {
  __typename?: 'Mutation',
  signUp: {
    __typename?: 'AuthUser',
    userInfo: { __typename?: 'Self', id: string, displayName: string, avatar: string } | null
  }
};

export type UsersQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type UsersQuery = {
  __typename?: 'Query',
  users: Array<{ __typename?: 'User', id: string, displayName: string, avatar: string }>
};


export const SigninWithOtpDocument = {
  "kind": "Document", "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": {"kind": "Name", "value": "SigninWithOTP"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "username"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "password"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "otp"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet", "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "signIn"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "username"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "username"}}
        }, {
          "kind": "Argument",
          "name": {"kind": "Name", "value": "password"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "password"}}
        }, {
          "kind": "Argument",
          "name": {"kind": "Name", "value": "otp"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "otp"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {"kind": "Name", "value": "userInfo"},
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "displayName"}
              }, {"kind": "Field", "name": {"kind": "Name", "value": "avatar"}}]
            }
          }, {
            "kind": "Field",
            "name": {"kind": "Name", "value": "token"},
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "accessToken"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "refreshToken"}
              }]
            }
          }]
        }
      }]
    }
  }]
} as unknown as DocumentNode<SigninWithOtpMutation, SigninWithOtpMutationVariables>;
export const MeDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {"kind": "Name", "value": "Me"},
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "me"},
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "enabledTwofa"}}]
        }
      }]
    }
  }]
} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const Generate2FaSecretDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": {"kind": "Name", "value": "Generate2FASecret"},
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "generate2FASecret"},
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "secret"}}, {
            "kind": "Field",
            "name": {"kind": "Name", "value": "qrCode"}
          }]
        }
      }]
    }
  }]
} as unknown as DocumentNode<Generate2FaSecretMutation, Generate2FaSecretMutationVariables>;
export const Enable2FaDocument = {
  "kind": "Document", "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": {"kind": "Name", "value": "Enable2FA"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "secret"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "otp"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "enable2FA"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "secret"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "secret"}}
        }, {
          "kind": "Argument",
          "name": {"kind": "Name", "value": "otp"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "otp"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "success"}}]
        }
      }]
    }
  }]
} as unknown as DocumentNode<Enable2FaMutation, Enable2FaMutationVariables>;
export const SignInDocument = {
  "kind": "Document", "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": {"kind": "Name", "value": "Index"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "username"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "password"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "signIn"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "username"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "username"}}
        }, {
          "kind": "Argument",
          "name": {"kind": "Name", "value": "password"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "password"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {"kind": "Name", "value": "userInfo"},
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "displayName"}
              }, {"kind": "Field", "name": {"kind": "Name", "value": "avatar"}}]
            }
          }]
        }
      }]
    }
  }]
} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const CreateConversationDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": {"kind": "Name", "value": "CreateConversation"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "memberIds"}},
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
        }
      }
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "createConversation"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "type"},
          "value": {"kind": "EnumValue", "value": "PRIVATE"}
        }, {
          "kind": "Argument",
          "name": {"kind": "Name", "value": "memberIds"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "memberIds"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}]
        }
      }]
    }
  }]
} as unknown as DocumentNode<CreateConversationMutation, CreateConversationMutationVariables>;
export const UserDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {"kind": "Name", "value": "User"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "user"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "id"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
            "kind": "Field",
            "name": {"kind": "Name", "value": "avatar"}
          }, {"kind": "Field", "name": {"kind": "Name", "value": "displayName"}}]
        }
      }]
    }
  }]
} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const InitUiQueryDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {"kind": "Name", "value": "InitUiQuery"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "conversation"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "id"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "name"}}, {
            "kind": "Field",
            "name": {"kind": "Name", "value": "type"}
          }]
        }
      }]
    }
  }]
} as unknown as DocumentNode<InitUiQueryQuery, InitUiQueryQueryVariables>;
export const FetchMessageQueryDocument = {
  "kind": "Document", "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {"kind": "Name", "value": "FetchMessageQuery"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}},
      "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "DateTime"}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}},
      "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "DateTime"}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "limit"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "Int"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet", "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "conversation"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "id"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "id"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet", "selections": [{
            "kind": "Field",
            "name": {"kind": "Name", "value": "messages"},
            "arguments": [{
              "kind": "Argument",
              "name": {"kind": "Name", "value": "messageBefore"},
              "value": {"kind": "Variable", "name": {"kind": "Name", "value": "before"}}
            }, {
              "kind": "Argument",
              "name": {"kind": "Name", "value": "messageAfter"},
              "value": {"kind": "Variable", "name": {"kind": "Name", "value": "after"}}
            }, {
              "kind": "Argument",
              "name": {"kind": "Name", "value": "messageLimit"},
              "value": {"kind": "Variable", "name": {"kind": "Name", "value": "limit"}}
            }],
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "content"}
              }, {"kind": "Field", "name": {"kind": "Name", "value": "createdAt"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "sentTime"}
              }, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "fromUser"},
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                    "kind": "Field",
                    "name": {"kind": "Name", "value": "displayName"}
                  }, {"kind": "Field", "name": {"kind": "Name", "value": "avatar"}}]
                }
              }]
            }
          }]
        }
      }]
    }
  }]
} as unknown as DocumentNode<FetchMessageQueryQuery, FetchMessageQueryQueryVariables>;
export const SendMessageMutationDocument = {
  "kind": "Document", "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": {"kind": "Name", "value": "SendMessageMutation"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "conversationId"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "ID"}}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "content"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "sendMessage"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "conversation_id"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "conversationId"}}
        }, {
          "kind": "Argument",
          "name": {"kind": "Name", "value": "content"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "content"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "correlationId"}}]
        }
      }]
    }
  }]
} as unknown as DocumentNode<SendMessageMutationMutation, SendMessageMutationMutationVariables>;
export const SignUpDocument = {
  "kind": "Document", "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": {"kind": "Name", "value": "SignUp"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "username"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }, {
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "password"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "signUp"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "username"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "username"}}
        }, {
          "kind": "Argument",
          "name": {"kind": "Name", "value": "password"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "password"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": {"kind": "Name", "value": "userInfo"},
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
                "kind": "Field",
                "name": {"kind": "Name", "value": "displayName"}
              }, {"kind": "Field", "name": {"kind": "Name", "value": "avatar"}}]
            }
          }]
        }
      }]
    }
  }]
} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const UsersDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": {"kind": "Name", "value": "Users"},
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {"kind": "Variable", "name": {"kind": "Name", "value": "searchTerm"}},
      "type": {"kind": "NonNullType", "type": {"kind": "NamedType", "name": {"kind": "Name", "value": "String"}}}
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": {"kind": "Name", "value": "users"},
        "arguments": [{
          "kind": "Argument",
          "name": {"kind": "Name", "value": "searchTerm"},
          "value": {"kind": "Variable", "name": {"kind": "Name", "value": "searchTerm"}}
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{"kind": "Field", "name": {"kind": "Name", "value": "id"}}, {
            "kind": "Field",
            "name": {"kind": "Name", "value": "displayName"}
          }, {"kind": "Field", "name": {"kind": "Name", "value": "avatar"}}]
        }
      }]
    }
  }]
} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
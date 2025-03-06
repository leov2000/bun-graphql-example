import { Message } from '../schema/types';

export interface MessageStoreType {
  users: {
    [userId: string]: Message[];
  };
}

export interface GroupsType {
  [groupId: string]: string[]
}

export interface QueryResolvers {
  getUserMessages: (
    _parent: unknown, 
    args: { userId: string }
  ) => Message[] | Promise<Message[]>;
  
  getGroupMembers: (
    _parent: unknown, 
    args: { groupId: string }
  ) => string[] | Promise<string[]>;
}

export interface SubscriptionResolvers {
  userMessages: {
    resolve: (payload: Message) => Message;
    subscribe: (
      _parent: unknown, 
      args: { userId: string }
    ) => AsyncIterator<Message> | Promise<AsyncIterator<Message>>;
  };
  
  groupMessages: {
    resolve: (payload: Message) => Message;
    subscribe: (
      _parent: unknown, 
      args: { groupId: string }
    ) => AsyncIterator<Message> | Promise<AsyncIterator<Message>>;
  };
}

export interface MutationResolvers {
  sendMessage: (
    _parent: unknown, 
    args: { to: string; from: string; text: string }
  ) => boolean | Promise<boolean>;
  
  sendGroupMessage: (
    _parent: unknown, 
    args: { toGroup: string; from: string; text: string }
  ) => boolean | Promise<boolean>;
}

export interface Resolvers {
  Query: QueryResolvers;
  Subscription: SubscriptionResolvers;
  Mutation: MutationResolvers;
}
import { Message } from '../schema/types';
import { MessageStoreType, GroupsType, Resolvers } from './types';

const messageStore: MessageStoreType = {
  users: {},
};

const groups: GroupsType = {
  groupA: ['bob', 'pratima', 'darrell', 'leslie'],
  groupB: ['hannah', 'dillon', 'courtney', 'jose'],
};

export const resolvers: Resolvers = {
  Query: {
    getUserMessages: (_parent: unknown, { userId }: { userId: string }) => {
      return messageStore.users[userId] || [];
    },
    getGroupMembers: (_parent: unknown, { groupId }: { groupId: string }) => {
      return groups[groupId] || [];
    },
  },
  Subscription: {
    userMessages: {
      resolve: (payload: Message): Message => payload,
      subscribe: async function* (_parent: unknown, { userId }: { userId: string }) {
        const channel = new BroadcastChannel(`user:${userId}`);
        let messageResolver: ((value: Message) => void) | null = null;

        channel.onmessage = (event: MessageEvent) => {
          if (messageResolver) {
            messageResolver(event.data);
            messageResolver = null;
          }
        };

        try {
          while (true) {
            const message = await new Promise<Message>((value) => {
              messageResolver = value;
            });
            console.log(message, 'message from subscription');
            yield message;
          }
        } catch (error) {
          console.error(`Subscription error for user ${userId}:`, error);
        } finally {
          console.log('channel closed');
          channel.close();
        }
      },
    },
    groupMessages: {
      resolve: (payload: Message) => payload,
      subscribe: async function* (_parent: unknown, { groupId }: { groupId: string }) {
        const channel = new BroadcastChannel(`group:${groupId}`);
        let resolver: ((value: Message) => void) | null = null;

        channel.onmessage = (event: MessageEvent) => {
          if (resolver) {
            resolver(event.data);
            resolver = null;
          }
        };

        try {
          while (true) {
            const message = await new Promise<Message>((resolve) => {
              resolver = resolve;
            });
            yield message;
          }
        } catch (error) {
          console.error(`Subscription error for group ${groupId}:`, error);
        } finally {
          channel.close();
        }
      },
    },
  },
  Mutation: {
    sendMessage: (
      _parent: unknown,
      { to, from, text }: { to: string; from: string; text: string },
    ) => {
      const message: Message = { to, from, text };
      console.log(message, 'message here');

      if (!messageStore.users[to]) {
        messageStore.users[to] = [];
      }

      messageStore.users[to].push(message);

      const channel = new BroadcastChannel(`user:${to}`);

      channel.postMessage(message);
      channel.close();

      return true;
    },
    sendGroupMessage: (
      _parent: unknown,
      { toGroup, from, text }: { toGroup: string; from: string; text: string },
    ) => {
      const message: Message = { to: toGroup, from, text };

      if (!groups[toGroup]) {
        console.error(`Group ${toGroup} does not exist`);
        return false;
      }

      const groupUsers = groups[toGroup];

      groupUsers.forEach((userId) => {
        if (!messageStore.users[userId]) {
          messageStore.users[userId] = [];
        }

        messageStore.users[userId].push({
          to: userId,
          from,
          text,
        });
      });

      const channel = new BroadcastChannel(`group:${toGroup}`);

      channel.postMessage(message);
      channel.close();

      return true;
    },
  },
};

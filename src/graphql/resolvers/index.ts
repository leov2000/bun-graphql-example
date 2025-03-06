import { Message } from '../schema';

export const resolvers = {
  Query: {
    dummy: () => 'Hello World',
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

      const channel = new BroadcastChannel(`group:${toGroup}`);
      channel.postMessage(message);
      channel.close();
      return true;
    },
  },
};

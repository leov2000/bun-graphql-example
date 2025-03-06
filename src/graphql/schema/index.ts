import { makeExecutableSchema } from '@graphql-tools/schema';
import { createYoga, YogaServerInstance } from 'graphql-yoga';
import { GraphQLSchema } from 'graphql';
import { resolvers } from '../resolvers';

export type Message = {
  to: string;
  from: string;
  text: string;
};

export const typeDefs: string = `
  type Message {
    time: String!
    uuid: String!
    to: String!
    from: String!
    text: String!
  }

  type Subscription {
    userMessages(userId: String!): Message
    groupMessages(groupId: String!): Message
  }

  type Mutation {
    sendMessage(to: String!, from: String!, text: String!): Boolean
    sendGroupMessage(toGroup: String!, from: String!, text: String!): Boolean
  }

  type Query {
    dummy: String!
  }
`;

export const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });
export const yoga: YogaServerInstance<{}, {}> = createYoga({
  schema,
  graphiql: false,
});

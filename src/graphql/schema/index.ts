import { makeExecutableSchema } from '@graphql-tools/schema';
import { createYoga, YogaServerInstance } from 'graphql-yoga';
import { GraphQLSchema} from 'graphql';
import { IResolvers } from '@graphql-tools/utils';
import { resolvers } from '../resolvers';

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
    getUserMessages(userId: String!): [Message]!
    getGroupMembers(groupId: String!): [String]!
  }
`;

export const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers: (resolvers as unknown as IResolvers<any, any>) });
export const yoga: YogaServerInstance<{}, {}> = createYoga({
  schema,
  graphiql: false,
});

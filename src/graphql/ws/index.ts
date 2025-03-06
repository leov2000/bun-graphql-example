import { ExecutionArgs } from '@envelop/types';
import { makeHandler } from 'graphql-ws/lib/use/bun';
import { WebSocketHandler } from 'bun';
import { schema, yoga } from '../schema';

export const websocketHandler: WebSocketHandler = makeHandler({
  schema,
  execute: (args: ExecutionArgs) => args.rootValue.execute(args),
  subscribe: (args: ExecutionArgs) => args.rootValue.subscribe(args),
  onSubscribe: async (ctx, msg) => {
    const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
      ...ctx,
      req: ctx.extra.request,
      socket: ctx.extra.socket,
      params: msg.payload,
    });

    const args = {
      schema,
      operationName: msg.payload.operationName,
      document: parse(msg.payload.query),
      variableValues: msg.payload.variables,
      contextValue: await contextFactory(),
      rootValue: {
        execute,
        subscribe,
      },
    };

    const errors = validate(args.schema, args.document);

    if (errors.length) {
      return errors;
    } else {
      return args;
    }
  },
});

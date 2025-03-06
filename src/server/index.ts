import Bun from 'bun';
import { renderAltairAssets } from '../graphql/altair';
import { yoga } from '../graphql/schema';
import { websocketHandler } from '../graphql/ws';

Bun.serve({
  fetch: async (request: Request, server: Bun.Server): Promise<Response> => {
    if (server.upgrade(request)) {
      return new Response();
    }

    const url = new URL(request.url);

    if (url.pathname === '/altair' || url.pathname.startsWith('/altair/')) {
      return renderAltairAssets(url);
    }

    return yoga.fetch(request, server);
  },
  port: 8000,
  websocket: websocketHandler,
});

console.log(`
  Server running at http://localhost:8000
  GraphQL endpoint: http://localhost:8000/graphql
  Altair GraphQL client: http://localhost:8000/altair
`);

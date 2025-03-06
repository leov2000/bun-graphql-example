import Bun from 'bun';
import { getDistDirectory, renderAltair } from 'altair-static';

export const altairDistPath: string = getDistDirectory();
export const altairHtml: string = renderAltair({
  baseURL: '/altair/',
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:8000/graphql',
});

export const renderAltairAssets = (url: URL): Promise<Response> | Response => {
  if (url.pathname === '/altair') {
    return new Response(altairHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  } else {
    return (async () => {
      const relativePath = url.pathname.replace('/altair/', '');
      const fileToServe = `${altairDistPath}/${relativePath}`;

      try {
        const data = await Bun.file(fileToServe).arrayBuffer();
        let contentType = 'application/octet-stream';
        if (relativePath.endsWith('.js')) contentType = 'application/javascript';
        if (relativePath.endsWith('.css')) contentType = 'text/css';
        if (relativePath.endsWith('.svg')) contentType = 'image/svg+xml';
        if (relativePath.endsWith('.png')) contentType = 'image/png';
        if (relativePath.endsWith('.ico')) contentType = 'image/x-icon';

        return new Response(data, {
          headers: { 'Content-Type': contentType },
        });
      } catch {
        return new Response('Not Found', { status: 404 });
      }
    })();
  }
};

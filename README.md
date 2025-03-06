# GraphQL Messaging App

A real-time messaging application built with GraphQL, Yoga, Bun, and WebSockets.

## Features

- Real-time messaging with WebSockets.
- Direct messaging between users.
- Group messaging support.
- GraphQL API for flexible data querying.

## Technologies

- **Bun**: JavaScript runtime & package manager.
- **GraphQL Yoga**: GraphQL Server.
- **WebSockets**: For real-time messaging. 
- **Altair**: GraphQL UI client.

## Getting Started

### Prerequisites

- Bun installed ([Installation guide](https://bun.sh/docs/installation))


### Running the Server

```bash
bun install

bun run dev
```

The GraphQL server will be available at `http://localhost:8000/graphql`.

### Testing with Altair

Open Altair GraphQL Client and connect to the server endpoint to test.

The GraphQL server will be available at `http://localhost:8000/altair`.
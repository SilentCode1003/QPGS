This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Client

## Prerequisites

- [ ] Node.js v18 or greater

## Setup

1. Install packages by running:

```sh
npm install
```

2. Create a _.env_ file using the _.env.example_ file as a template.

## Development

1. Start server in watch mode:

```sh
npm run dev
```

2. To lint code using eslint, run:

```sh
npm run lint
```

## Production

1. Compile the source files:

```sh
npm run build
```

2. Start the server:

```sh
npm start
```

## Project Structure

This project's folder structure has taken inspiration from [bulletproof-react](https://github.com/alan2207/bulletproof-react). If you aren't sure about where to create files, read the bulletproof-react docs.

    .
    ├── api           # React query wrapper hooks for connecting to API
    ├── app           # Next routes
    ├── components    # Components that can be used globally
    ├── config        # Env and constant value data
    ├── lib           # Api clients
    ├── public        # Unchanging assets
    └── utils         # Various utility functions

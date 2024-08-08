# Server

## Prerequisites

- [ ] Node.js v18 or greater
- [ ] MySQL 8.3.0
- [ ] MongoDB 7.0.6

## Setup

1. Install packages by running:

```sh
npm install
```

2. Create a _.env_ file using the _.env.example_ file as a template.
3. Setup database and prisma by running:

```sh
npm run db:setup
```

## Development

1. Start server in watch mode:

```sh
npm run dev
```

2. After saving your changes in _schema.prisma_, run:

```sh
npm run db:migrate
```

3. To reset the database with seeded data:

```sh
npm run db:reset
```

4. To seed the database:

```sh
npm run db:seed
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

# Server

## Prerequisites

- [ ] Node.js v18 or greater
- [ ] MySQL 8.3.0
- [ ] MongoDB 7.0.6
- [ ] [Bruno](https://github.com/usebruno/bruno) (optional)

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

5. To lint code using eslint, run:

```sh
npm run lint
```

6. To format code using prettier, run:

```sh
npm run format
```

### Template editing

This project uses [docx-templates](https://github.com/guigrpa/docx-templates) for document editing and templating. See the docs to learn how to create templates.

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

    .
    ├── bruno               # Bruno api files
    ├── dist                # Created when typescript is compiled
    ├── logs                # Created when in production
    ├── node_modules        # I trust you already know this
    ├── prisma              # Prisma migrations and seed script
    ├── reports             # Output directory of generated reports
    ├── src                 # Source files
    |   ├── config          # Env and constant values
    |   ├── db              # ORM files
    |   ├── handlers        # Handlers/controllers for routes
    |   ├── middlewares     # Middlewares for auth, error, etc.
    |   ├── routes          # API routes
    |   ├── startup         # Necessary express middlewares
    |   └── utils           # Utility functions
    └── templates           # Template documents

## Naming conventions

### File names

- Prefer one word if possible
- Use kebab-case
- If possible, add folder name before the extension ex. auth.middleware.ts

### Variable names

- use camelCase
- use snake_case on prisma schema model and column names

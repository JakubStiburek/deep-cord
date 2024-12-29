# deep-cord api

## Local dependencies

- Postgres

Dependencies run in Docker containers. You need to only run the up command:

```shell
docker compose up -d
```

To stop the containers run:

```shell
docker compose down
```

You can use your preferred database client to connect to the Postgres database.
See docker compose for the connection details.

You can also run `./scripts/connect-db.sh` which will run `pgcli` and connect
to the Postgres database.

> PNPM recommended
>
> All referenced scripts from package.json run with pnpm in the examples but you
> can use npm or yarn as well

```shell
pnpm run db:pgcli
```

To start the Nest server run:

```shell
# First time install Dependencies
pnpm i
pnpm run start:dev
```

The server runs on PORT 3000. You'll find the OpenAPI documentation at `http://localhost:3000/api`

To run unit tests:

```shell
# In watch mode
pnpm run test:watch
# Or just once
pnpm run test
```

## Migrations

We use Go utility [migrate](https://pkg.go.dev/github.com/golang-migrate/migrate/v4#readme-migration-files).
Install it on MacOS using brew or see the docs for installation on your system.

```shell
brew install golang-migrate
```

Create migration files:

```shell
pnpm run db:migrate:create {migration_name}
```

Run migration:

```shell
pnpm run db:migrate
```

Roll back migration(s):

```shell
# Roll back all migrations
pnpm run db:migrate:down
# Roll back to a specific migration (version)
pnpm run db:migreat:down {version number}
```

Generate TypeScript types from database schema after each migration.

```shell
pnpm run db:types:generate
```

# deep-cord

## API

### Local

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

You can also run `./connect-db.sh` which will run `pgcli` and connect to the
Postgres database.

To start the Nest server run:

```shell
cd api
# First time install Dependencies
pnpm i
pnpm run start:dev
```

To run unit tests:

```shell
cd api
# In wathc mode
pnpm run test:watch
# Or just once
pnpm run test
```

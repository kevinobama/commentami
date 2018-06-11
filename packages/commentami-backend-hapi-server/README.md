# @nearform/commentami-backend-hapi-server

`@nearform/commentami-backend-hapi-server` is a ready to use [Hapi][hapi] server with the `@nearform/commentami-backend-hapi-plugin` registered and websockets enabled.

## Install

To install via npm:

```
npm install @nearform/commentami-backend-hapi-server
```

## Configuration

You can use the following env variables to configure the server:

```
## server specific variables
NF_COMMENTS_SERVER_HOST
NF_COMMENTS_SERVER_PORT

# websocket specific variables
NF_COMMENTS_SERVER_MULTINES_TYPE
NF_COMMENTS_SERVER_MULTINES_HOST
NF_COMMENTS_SERVER_MULTINES_PORT
```

By default the configuration of the server is for running locally.

You can also change the databse connection parameters through `@nearform/commentami-backend-core` env variables. See `@nearform/commentami-backend-core` documentation for more info

## Dependency

To run the server you will need a postgres server (store comments) and a redis server (pub.sub system for notifications via websocket).

## Usage

```
npx run commentami-backend-hapi-server
```

This will start a server on `localhost:8080`.

## Run tests

You will need a postgres server up and running.

To create the db needed for the tests you can use the following command

```
npm run pg:test:init
```

and the run

```
npm test
```

To run a single test you can use the following command

```
npx lab <test/to/run.js> // (ie: npx lab test/index.test.js)
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[hapi]: https://hapijs.com/
[license]: ./LICENSE.md
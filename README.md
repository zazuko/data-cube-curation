> # RDF Data Cube curation service

## API

### Running locally

First, copy `api/.env.local` to `api/.env` and add the missing variables.
See the [`api/README.md`](api/README.md) file for details.

The variables assume a local Fuseki instance running on port 3030.

To setup Fuseki, you can use the provided docker-compose setup.
It will automatically start Fuseki in a docker container and create two datasets:
"data-cube-e2e" and "data-cube-read".
The same script can be used to reset the triplestore:

```
npm run setup:fuseki
```

Once that's done run from the repository root:

```
npm i
npm run start:api
```

### Tests

The [hypertest](https://testing.hypermedia.app) scenarios can be run with 
`npm test`. When executed on a fresh repository it will also invoke 
the installation operation, thus bootstrapping the API for use. 

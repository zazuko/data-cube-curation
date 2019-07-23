> # RDF Data Cube curation service

## API

### Running locally

First, copy `api/.env.local` to `api/.env` and add the missing variables:

* DYDRA_USER
* DYDRA_REPO
* DYDRA_API_KEY

You can get those value by creating a repository on [dydra.com](https://dydra.com)

Alternatively, you may replace the `SPARQL_ENDPOINT` variable completely with your
desired installation URL. 

Once that's done run from the repository root:

```
npm i
npm run start:api
```

### Tests

The [hypertest](https://testing.hypermedia.app) scenarios can be run with 
`npm test`. When executed on a fresh repository it will also invoke 
the installation operation, thus bootstrapping the API for use. 

> # RDF Data Cube curation service

## API

### Running locally

First, copy `api/.env.local` to `api/.env` and add the missing variables:

* DYDRA_USER
* DYDRA_REPO
* DYDRA_API_KEY

Alternatively, you may replace the URL completely with your desired SPARQL
endpoint. 

Once that's done run from the repository root:

```
npm i
npm run start:api
```

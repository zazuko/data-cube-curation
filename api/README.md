# Data Cube Curation API

## Settings

Most settings configurable by environment variables defined in `.env` file.
Below are some possible sample settings showing how to configure certain parts
of the server.

Variable expansion is also possible, that is variables can use other variables
to reduce duplication.

### Base server settings

```dotenv
PORT=5678
BASE_URI=http://localhost:${PORT}/
```

### SPARQL endpoint settings

Two writable SPARQL stores are required to run the application.
In both cases the `*_UPDATE_ENDPOINT` can be omitted if the triple store
has a single endpoint for both queries and updates.

Here's an example running a local fuseki.

```dotenv
FUSEKI_URL=http://localhost:3030

SPARQL_ENDPOINT=${FUSEKI_URL}/data-cube-e2e/query
SPARQL_UPDATE_ENDPOINT=${FUSEKI_URL}/data-cube-e2e/update

READ_MODEL_SPARQL_ENDPOINT=${FUSEKI_URL}/data-cube-read/query
READ_MODEL_SPARQL_UPDATE_ENDPOINT=${FUSEKI_URL}/data-cube-read/update
```

### Storing files locally

This will store files locally, in a path relative to the api sources.

```dotenv
STORAGE=local
STORAGE_FILESYSTEM_PATH=uploads
```

### Storing files on S3

These variables will have the server store files on S3

```dotenv
STORAGE=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_ENDPOINT=fra1.digitaloceanspaces.com
AWS_S3_BUCKET=data-cube-curation
```

In the case of Digital Ocean, the `AWS_S3_BUCKET` is also the Space's name.

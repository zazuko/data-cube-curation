> # Data Cube Curation CLI

Dockerized runner of Data Cube Curation projects

## Running

The general syntax of the runner to transform:

```
Usage: docker run --rm zazuko/datacube-cli transform [options]

Transforms source files to RDF

Options:
  --from <sourceName>          Source of input files (built-in: 'filesystem', 's3')
  --to <targetName>            Target to write triples (built-in: 'stdout', 'filesystem', 'graph-store')
  --project <project>          URL of a Data Cube Curation project
  -v, --variable <name=value>  Pipeline variables (default: {})
  --debug                      Print diagnostic information to standard output
  -h, --help                   output usage information
```

The possible options and their arguments are described below. Each argument is
provided by the `-v, --variable` option. For example

```
docker run --rm zazuko/datacube-cli transform -v sourceDir=/downloads/csv -v targetFile=./converted.nt
``` 

### `--from filesystem`

Loads input files a local filesystem path.

#### Arguments

* `sourceDir`
  * default: `/input`

### `--from s3`

Loads input files from an S3 bucket.

#### Arguments

* `s3endpoint`
* `s3bucket`

Also, two environment variables must be set to authorize access to the S3
service: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

### `--to stdout`

Streams transformed triples to standard output

### `--to filesystem`

Streams transformed triples as n-triples to a single file

#### Arguments

* `targetFile`
  * default: `/output/transformed.nt`

### `--to s3`

Streams transformed triples to an S3 bucket.

#### Arguments

Same as for [`--from s3`](#--from-s3) above, and:

* `targetFile`
  * default: `transformed.nt`
  
### `--to graph-store`

Streams transformed triples to a store using the graph protocol

#### Arguments

* `graph`
* `graph-store-endpoint`
* `graph-store-user`
* `graph-store-password`

## Run from sources

Here's an example of converting local files using a locally-built image:

1. Place source csv files in directory `~/packages/cli/input`
1. (optionally) Ensure a fresh container is built 

    ```
    docker-composer build cli
    ```
1. Run with docker-compose

    ```
    docker-compose run --rm cli transform \ 
        --from filesystem \
        --to filesystem \
        --project <URI>
        --debug
    ```

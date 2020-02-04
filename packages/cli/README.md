> # Data Cube Curation CLI

Dockerized runner of Data Cube Curation projects

## Run from sources

1. Run `npm i` in the repository root
1. Place source csv files in directory `~/packages/cli/input`
1. Run with docker-compose

    ```
    docker-compose run --rm cli <uri> --verbose
    ```

## Running from image

First, build the image with `docker build . -f cli.Dockerfile -t datacube-cli`

The input and output directories must be mounted as `/input` and `/output` respectively.

```
docker run --rm \
  -v /local/input/path:/input \
  -v /local/output/path:/output \
  datacube-cli:latest \
  <uri> \
  --verbose
```

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.1.0 (2019-10-31)


### Bug Fixes

* send base collection triples for /projects resource ([d49ece8](https://github.com/zazuko/data-cube-curation/commit/d49ece8))
* **docker:** listen on $PORT ([85ddc25](https://github.com/zazuko/data-cube-curation/commit/85ddc25))
* **docker:** move typescript in production deps ([2b4bd94](https://github.com/zazuko/data-cube-curation/commit/2b4bd94))
* 201 after project is being PUT ([4a0372d](https://github.com/zazuko/data-cube-curation/commit/4a0372d))
* bring back columns property of a source ([2b4d873](https://github.com/zazuko/data-cube-curation/commit/2b4d873))
* ensure that only columns from source are allowed in an attribute ([e63019d](https://github.com/zazuko/data-cube-curation/commit/e63019d))
* ensure that project is recognized as linked from table ([f245dd9](https://github.com/zazuko/data-cube-curation/commit/f245dd9))
* ensure that project is recognized as linked from table ([c7bd694](https://github.com/zazuko/data-cube-curation/commit/c7bd694))
* incorrect check for existence of project (must await) ([01ddb75](https://github.com/zazuko/data-cube-curation/commit/01ddb75))
* missing namespace in query fails on Fuseki ([ea1f563](https://github.com/zazuko/data-cube-curation/commit/ea1f563))
* names missing in projects collection ([a282526](https://github.com/zazuko/data-cube-curation/commit/a282526))
* return informative errors for domain problems ([f95792c](https://github.com/zazuko/data-cube-curation/commit/f95792c))
* the header must also be stored with the sample file ([53dca76](https://github.com/zazuko/data-cube-curation/commit/53dca76))
* typo which broke sparql ([adc70db](https://github.com/zazuko/data-cube-curation/commit/adc70db))
* use a local property for attribute's data type ([fde65c3](https://github.com/zazuko/data-cube-curation/commit/fde65c3))
* **create-source:** missing schema NS prefix ([b465299](https://github.com/zazuko/data-cube-curation/commit/b465299))
* **ddd:** aggregate root's factory did not work ([26a80e3](https://github.com/zazuko/data-cube-curation/commit/26a80e3))
* projects resource is missing project names ([4a89609](https://github.com/zazuko/data-cube-curation/commit/4a89609))
* the sources collection resource representation ([e4fe5aa](https://github.com/zazuko/data-cube-curation/commit/e4fe5aa))
* wrong hydra property ([63db81a](https://github.com/zazuko/data-cube-curation/commit/63db81a))
* wrong xsd type ([edc26e7](https://github.com/zazuko/data-cube-curation/commit/edc26e7))


### Features

* add global handler to return application/problem+json on errors ([6c5faed](https://github.com/zazuko/data-cube-curation/commit/6c5faed))
* add installation operation ([8a760d7](https://github.com/zazuko/data-cube-curation/commit/8a760d7))
* add link to project's sources collection ([b789837](https://github.com/zazuko/data-cube-curation/commit/b789837))
* add projects property to entrypoint ([3ffb58a](https://github.com/zazuko/data-cube-curation/commit/3ffb58a))
* add projest collection link ([ac64225](https://github.com/zazuko/data-cube-curation/commit/ac64225))
* allow multiple sources under a single project ([7b7ff93](https://github.com/zazuko/data-cube-curation/commit/7b7ff93))
* cascade delete sources/columns when project is deleted ([eb5a145](https://github.com/zazuko/data-cube-curation/commit/eb5a145))
* cascade delete when project is deleted ([6f9d890](https://github.com/zazuko/data-cube-curation/commit/6f9d890))
* cascade delete when project is deleted ([6df3544](https://github.com/zazuko/data-cube-curation/commit/6df3544))
* cascade deletion of attributes when table is deleted ([f3f6a40](https://github.com/zazuko/data-cube-curation/commit/f3f6a40))
* create a column attribute for a table ([eebb974](https://github.com/zazuko/data-cube-curation/commit/eebb974))
* created a preview resource which run csvw parser on stored sample ([60ded21](https://github.com/zazuko/data-cube-curation/commit/60ded21))
* creating a data cube project from a CSV file ([fbb3e7b](https://github.com/zazuko/data-cube-curation/commit/fbb3e7b))
* creating a fact table, cqrs-way ([ea1323e](https://github.com/zazuko/data-cube-curation/commit/ea1323e))
* creating the fact table ([5a3ef5e](https://github.com/zazuko/data-cube-curation/commit/5a3ef5e))
* deleting project ([0458bec](https://github.com/zazuko/data-cube-curation/commit/0458bec))
* entrypoint resource ([d773010](https://github.com/zazuko/data-cube-curation/commit/d773010))
* initial version of a ddd-link approach ([184f01f](https://github.com/zazuko/data-cube-curation/commit/184f01f))
* link table to its CSVW document ([a6c3e89](https://github.com/zazuko/data-cube-curation/commit/a6c3e89))
* linking project to its fact table resource ([914e01c](https://github.com/zazuko/data-cube-curation/commit/914e01c))
* return useful representation when the source upload fails ([233500f](https://github.com/zazuko/data-cube-curation/commit/233500f))
* started creating csvw metadata resource ([9f33ae7](https://github.com/zazuko/data-cube-curation/commit/9f33ae7))
* updated posting of project source ([5e1668e](https://github.com/zazuko/data-cube-curation/commit/5e1668e))
* use events to delete a project ([4e7f3e2](https://github.com/zazuko/data-cube-curation/commit/4e7f3e2))
* use events to populate read mode of project ([dcb1b08](https://github.com/zazuko/data-cube-curation/commit/dcb1b08))
* **project:** prevent same source from being uploaded twice ([e950511](https://github.com/zazuko/data-cube-curation/commit/e950511))
* **source:** store the sample rows in file system ([baa1e75](https://github.com/zazuko/data-cube-curation/commit/baa1e75))

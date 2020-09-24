# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.1](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-api@0.6.0...data-cube-curation-api@0.6.1) (2020-09-24)


### Bug Fixes

* **api:** send request access link on all auth error responses ([8f180fa](https://github.com/zazuko/data-cube-curation/commit/8f180fa0aabc4c4c9da65fb217aa25f858fad5b4))





# [0.6.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-api@0.5.0...data-cube-curation-api@0.6.0) (2020-09-21)


### Bug Fixes

* **api:** the AUTH_CONFIG_FILE was not read ([bf8ad57](https://github.com/zazuko/data-cube-curation/commit/bf8ad5706eb55640ab4ddeea623557a8067fdb0a))


### Features

* **api:** return access request link in 403 responses ([48de2dc](https://github.com/zazuko/data-cube-curation/commit/48de2dc62b325ac5d061ac5f70a893fe517080b7))





# [0.5.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-api@0.4.0...data-cube-curation-api@0.5.0) (2020-09-09)


### Bug Fixes

* delete datatype params on cascade when attribute is removed ([5659165](https://github.com/zazuko/data-cube-curation/commit/5659165102865c2b93507fcf7217c091219587f8))


### Features

* make the oidc config runtime configurable ([9316da5](https://github.com/zazuko/data-cube-curation/commit/9316da5e23365b518102609f8a7371c076ccf06d))





# [0.4.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-api@0.3.1...data-cube-curation-api@0.4.0) (2020-07-20)


### Features

* **api:** secure the API with JWT token ([7dd158b](https://github.com/zazuko/data-cube-curation/commit/7dd158b601424f542159bf18b908c2b4d51eb2f9))
* **ui:** add open id connect to front end ([69b0446](https://github.com/zazuko/data-cube-curation/commit/69b0446116a584c032984740423d00a72d7a14fa))





## [0.3.1](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-api@0.3.0...data-cube-curation-api@0.3.1) (2020-06-22)


### Bug Fixes

* **cli:** handle csvs with BOM ([4d7293b](https://github.com/zazuko/data-cube-curation/commit/4d7293b)), closes [#243](https://github.com/zazuko/data-cube-curation/issues/243)





# [0.3.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-api@0.2.0...data-cube-curation-api@0.3.0) (2020-05-06)


### Bug Fixes

* **api:** project would have two names when updating ([440709c](https://github.com/zazuko/data-cube-curation/commit/440709c)), closes [#272](https://github.com/zazuko/data-cube-curation/issues/272)
* **api:** remove empty INSERT from DELETE, which would fail in Stardog ([31336b3](https://github.com/zazuko/data-cube-curation/commit/31336b3)), closes [tpluscode/sparql-builder#12](https://github.com/tpluscode/sparql-builder/issues/12)
* ensure that identifierTemplate is empty string when missing ([5efbf6f](https://github.com/zazuko/data-cube-curation/commit/5efbf6f))
* not all triples were being removed from read model ([c109382](https://github.com/zazuko/data-cube-curation/commit/c109382))
* validate the identifier template when creating and updating tables ([aabeb79](https://github.com/zazuko/data-cube-curation/commit/aabeb79))
* **api:** add missing property to FactTable class ([d7f121c](https://github.com/zazuko/data-cube-curation/commit/d7f121c))


### Features

* **api:** ability to change table's name and id template ([6d2c8b9](https://github.com/zazuko/data-cube-curation/commit/6d2c8b9))
* generating a URL based on dimension columns ([fd9ae1c](https://github.com/zazuko/data-cube-curation/commit/fd9ae1c)), closes [#34](https://github.com/zazuko/data-cube-curation/issues/34)





# [0.2.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-api@0.1.0...data-cube-curation-api@0.2.0) (2020-03-30)


### Bug Fixes

* add qb:Observation column in CSVW mapping ([bb0ffda](https://github.com/zazuko/data-cube-curation/commit/bb0ffda))
* add schema:ViewAction type to sample operation ([667f7a6](https://github.com/zazuko/data-cube-curation/commit/667f7a6))
* all sources must be parsed using a specific csv dialect ([30c477c](https://github.com/zazuko/data-cube-curation/commit/30c477c))
* change DELETE query to work on Stardog (no empty INSERT clause) ([0942433](https://github.com/zazuko/data-cube-curation/commit/0942433)), closes [#122](https://github.com/zazuko/data-cube-curation/issues/122)
* column mapping link was not retrieved from the graph ([a874eec](https://github.com/zazuko/data-cube-curation/commit/a874eec)), closes [#203](https://github.com/zazuko/data-cube-curation/issues/203)
* convert a Buffer response from S3 to a stream ([5ae6e97](https://github.com/zazuko/data-cube-curation/commit/5ae6e97))
* correctly match %-encoded column names to source columns ([6bef7e3](https://github.com/zazuko/data-cube-curation/commit/6bef7e3))
* could not set s3 bucket when project had none initially ([6e89776](https://github.com/zazuko/data-cube-curation/commit/6e89776))
* csv delimiter and quote were not persisted with source ([4256986](https://github.com/zazuko/data-cube-curation/commit/4256986))
* csvw column title incorrectly correspond source ([1a6356e](https://github.com/zazuko/data-cube-curation/commit/1a6356e))
* csvw document does not include the url property ([e639217](https://github.com/zazuko/data-cube-curation/commit/e639217))
* detect the format ([a071dec](https://github.com/zazuko/data-cube-curation/commit/a071dec)), closes [#116](https://github.com/zazuko/data-cube-curation/issues/116)
* dialect does not save when it did not exist beforehand ([267a641](https://github.com/zazuko/data-cube-curation/commit/267a641))
* do not add "undefined" strings to triple store ([51f0d50](https://github.com/zazuko/data-cube-curation/commit/51f0d50))
* emit event to ensure triples are removed even if aggregate is gone ([2475efd](https://github.com/zazuko/data-cube-curation/commit/2475efd))
* ensure domain-only base URI ends in slash ([578db68](https://github.com/zazuko/data-cube-curation/commit/578db68))
* ensure that constructed URLs are plain ascii ([bc9e8e5](https://github.com/zazuko/data-cube-curation/commit/bc9e8e5)), closes [#75](https://github.com/zazuko/data-cube-curation/issues/75)
* getting request model did not remove non-existent nodes from result ([7e7486d](https://github.com/zazuko/data-cube-curation/commit/7e7486d))
* handle column names with spaces in them ([e5cf1ab](https://github.com/zazuko/data-cube-curation/commit/e5cf1ab)), closes [#202](https://github.com/zazuko/data-cube-curation/issues/202) [#201](https://github.com/zazuko/data-cube-curation/issues/201)
* have api serve types of project's source collection members ([3819f64](https://github.com/zazuko/data-cube-curation/commit/3819f64))
* include mapped columns in table attribute collection ([250b815](https://github.com/zazuko/data-cube-curation/commit/250b815)), closes [#150](https://github.com/zazuko/data-cube-curation/issues/150)
* include parameters in attribute collection ([b1fa7cf](https://github.com/zazuko/data-cube-curation/commit/b1fa7cf))
* incorrect usage of expand ([bf24fdd](https://github.com/zazuko/data-cube-curation/commit/bf24fdd))
* job trigger only worked when it was saved first ([cffd73e](https://github.com/zazuko/data-cube-curation/commit/cffd73e))
* language was not correctly persisted ([f4b8380](https://github.com/zazuko/data-cube-curation/commit/f4b8380)), closes [#162](https://github.com/zazuko/data-cube-curation/issues/162)
* let all tables be create by POST to TableCollection ([a73db70](https://github.com/zazuko/data-cube-curation/commit/a73db70))
* make express synchronous again 🚀 ([9dd2bee](https://github.com/zazuko/data-cube-curation/commit/9dd2bee))
* map parameters to csvw (derived) datatype according to spec ([2d1afb0](https://github.com/zazuko/data-cube-curation/commit/2d1afb0))
* mapping preview did not produce expected output ([5a4221b](https://github.com/zazuko/data-cube-curation/commit/5a4221b))
* missing base uri causes empty result ([0ec04f2](https://github.com/zazuko/data-cube-curation/commit/0ec04f2))
* missing hydra description of ReferenceAttribute ([c88b764](https://github.com/zazuko/data-cube-curation/commit/c88b764))
* must. slugify. table. name ([c16999a](https://github.com/zazuko/data-cube-curation/commit/c16999a)), closes [#257](https://github.com/zazuko/data-cube-curation/issues/257)
* pass csv dialect options to csvw mapping ([5c14e5a](https://github.com/zazuko/data-cube-curation/commit/5c14e5a))
* preserver order of source columns in collection ([3f9b12b](https://github.com/zazuko/data-cube-curation/commit/3f9b12b))
* project can be created with bogus name ([691ef6d](https://github.com/zazuko/data-cube-curation/commit/691ef6d))
* remove remaining instances of minted URIs ([7b733c2](https://github.com/zazuko/data-cube-curation/commit/7b733c2)), closes [#107](https://github.com/zazuko/data-cube-curation/issues/107)
* remove the schema:name supported property of dataCube:Attribute ([c00f9e0](https://github.com/zazuko/data-cube-curation/commit/c00f9e0)), closes [#119](https://github.com/zazuko/data-cube-curation/issues/119)
* rename API attr. operations and use in UI ([c8ed1cc](https://github.com/zazuko/data-cube-curation/commit/c8ed1cc))
* replace rdf:predicate with property template completely ([#181](https://github.com/zazuko/data-cube-curation/issues/181)) ([65ded7b](https://github.com/zazuko/data-cube-curation/commit/65ded7b))
* request model was not being correctly determined ([d9a790d](https://github.com/zazuko/data-cube-curation/commit/d9a790d)), closes [#231](https://github.com/zazuko/data-cube-curation/issues/231)
* respond with problem+json on any unhandled error ([cd2c570](https://github.com/zazuko/data-cube-curation/commit/cd2c570))
* retain order of uploaded source's columns ([e949457](https://github.com/zazuko/data-cube-curation/commit/e949457))
* return 404 when a project does not have a fact table ([b8a2c0e](https://github.com/zazuko/data-cube-curation/commit/b8a2c0e)), closes [#70](https://github.com/zazuko/data-cube-curation/issues/70)
* return 404 when project does not exist ([abaa150](https://github.com/zazuko/data-cube-curation/commit/abaa150)), closes [#196](https://github.com/zazuko/data-cube-curation/issues/196)
* return 404 when table is actually not there ([89c3c35](https://github.com/zazuko/data-cube-curation/commit/89c3c35))
* return attribute's representation when it gets created ([9460645](https://github.com/zazuko/data-cube-curation/commit/9460645))
* schema:name missing in supported properties of CsvSource ([2e3fed3](https://github.com/zazuko/data-cube-curation/commit/2e3fed3))
* select request model by desired RDF type ([ab0c88c](https://github.com/zazuko/data-cube-curation/commit/ab0c88c))
* set auth headers to sparql endpoint ([c0d1ccb](https://github.com/zazuko/data-cube-curation/commit/c0d1ccb))
* set base URI on the parser which reads the API docs graph ([72f56a0](https://github.com/zazuko/data-cube-curation/commit/72f56a0))
* sparql credentials are not consumed ([4142ae6](https://github.com/zazuko/data-cube-curation/commit/4142ae6)), closes [#79](https://github.com/zazuko/data-cube-curation/issues/79)
* store table name ([dc5a01d](https://github.com/zazuko/data-cube-curation/commit/dc5a01d))
* unable to get mapping result preview ([63e888a](https://github.com/zazuko/data-cube-curation/commit/63e888a))
* use a setting to raise file upload limit ([1b9ef25](https://github.com/zazuko/data-cube-curation/commit/1b9ef25))
* use property template instead of rdf:property ([cc91bc9](https://github.com/zazuko/data-cube-curation/commit/cc91bc9))
* use same method to slugify dimension table id ([dbaea6c](https://github.com/zazuko/data-cube-curation/commit/dbaea6c))
* use the single subject node as model if there are no others ([1b51dc0](https://github.com/zazuko/data-cube-curation/commit/1b51dc0))
* **api:** base URI was missing for projects ([6d2c4f6](https://github.com/zazuko/data-cube-curation/commit/6d2c4f6))
* **api:** improve project operations titles ([2595254](https://github.com/zazuko/data-cube-curation/commit/2595254))
* **api:** provide baseUri on /projects ([5a1e88e](https://github.com/zazuko/data-cube-curation/commit/5a1e88e))
* **docker:** use a simple history fallback middleware ([0864ed0](https://github.com/zazuko/data-cube-curation/commit/0864ed0)), closes [#80](https://github.com/zazuko/data-cube-curation/issues/80)
* **production:** api docs should be returned as https when proxied ([7c1c21b](https://github.com/zazuko/data-cube-curation/commit/7c1c21b))
* **production:** simple redirect from root to app ([40ad8e9](https://github.com/zazuko/data-cube-curation/commit/40ad8e9))


### Features

* **api:** added a graph URI used to store transformed triples ([3ada2e1](https://github.com/zazuko/data-cube-curation/commit/3ada2e1))
* triggering transformation job via jobs collection ([ee5dcb9](https://github.com/zazuko/data-cube-curation/commit/ee5dcb9))
* **ui:** edit CSV source settings ([e831230](https://github.com/zazuko/data-cube-curation/commit/e831230))
* a pipeline runner for data cube curation project ([e0fee8c](https://github.com/zazuko/data-cube-curation/commit/e0fee8c))
* accept datatype parameter format and default ([7c31d5b](https://github.com/zazuko/data-cube-curation/commit/7c31d5b))
* add a collection of tables resource ([c56952c](https://github.com/zazuko/data-cube-curation/commit/c56952c))
* add dataCube:identifierColumn to dimension table ([ca0b7e8](https://github.com/zazuko/data-cube-curation/commit/ca0b7e8)), closes [#141](https://github.com/zazuko/data-cube-curation/issues/141)
* add operation to delete source ([cc52ee0](https://github.com/zazuko/data-cube-curation/commit/cc52ee0))
* add reference attributes to generated CSVW mapping ([f43e7ad](https://github.com/zazuko/data-cube-curation/commit/f43e7ad))
* adding reference attribute ([60472d2](https://github.com/zazuko/data-cube-curation/commit/60472d2))
* apply base URI to csvw propertyUrl ([8859bf2](https://github.com/zazuko/data-cube-curation/commit/8859bf2))
* creating dimension table ([44a5a5e](https://github.com/zazuko/data-cube-curation/commit/44a5a5e)), closes [#26](https://github.com/zazuko/data-cube-curation/issues/26)
* delete (archive) a table ([c279b2b](https://github.com/zazuko/data-cube-curation/commit/c279b2b))
* endpoint to fetch a sample of the source csv ([764cab7](https://github.com/zazuko/data-cube-curation/commit/764cab7))
* fail when a csv has empty column names ([b01b40f](https://github.com/zazuko/data-cube-curation/commit/b01b40f))
* hydra operation to delete an attribute ([479fbb4](https://github.com/zazuko/data-cube-curation/commit/479fbb4))
* operation to update the details of a source ([3aaedbe](https://github.com/zazuko/data-cube-curation/commit/3aaedbe))
* **ui:** add project settings tab ([3166b1e](https://github.com/zazuko/data-cube-curation/commit/3166b1e))
* option to store source samples on AWS S3 ([a2c2559](https://github.com/zazuko/data-cube-curation/commit/a2c2559)), closes [#38](https://github.com/zazuko/data-cube-curation/issues/38)
* populate aboutUrl of csvw table schema ([1348d56](https://github.com/zazuko/data-cube-curation/commit/1348d56))
* populate aboutUrl of csvw table schema ([a226336](https://github.com/zazuko/data-cube-curation/commit/a226336))
* setting aboutUrl and valueUrl from reference attriutes ([bd82305](https://github.com/zazuko/data-cube-curation/commit/bd82305))
* validate dimension table identifier against source column names ([017cf6b](https://github.com/zazuko/data-cube-curation/commit/017cf6b))
* validate dimension table identifier against source column names ([f701d7b](https://github.com/zazuko/data-cube-curation/commit/f701d7b))


### Reverts

* csvw builder used without resource factory ([f2f6c0f](https://github.com/zazuko/data-cube-curation/commit/f2f6c0f))
* **tests:** keep the checks for Location header on POST responses ([6236f3d](https://github.com/zazuko/data-cube-curation/commit/6236f3d))
* unrelated change ([d21d829](https://github.com/zazuko/data-cube-curation/commit/d21d829))





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

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-ui@0.5.0...data-cube-curation-ui@0.6.0) (2020-09-09)


### Bug Fixes

* **ui:** make all API calls authenticated ([29500fe](https://github.com/zazuko/data-cube-curation/commit/29500fe1e22a41d7f3c5abd36fd047297e6a68be))


### Features

* make the oidc config runtime configurable ([9316da5](https://github.com/zazuko/data-cube-curation/commit/9316da5e23365b518102609f8a7371c076ccf06d))





# [0.5.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-ui@0.4.0...data-cube-curation-ui@0.5.0) (2020-07-20)


### Features

* **ui:** add open id connect to front end ([69b0446](https://github.com/zazuko/data-cube-curation/commit/69b0446116a584c032984740423d00a72d7a14fa))





# [0.4.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-ui@0.3.0...data-cube-curation-ui@0.4.0) (2020-05-06)


### Bug Fixes

* **ui:** avoid fetching API docs for every resource ([6413aef](https://github.com/zazuko/data-cube-curation/commit/6413aef))
* **ui:** identifier template validation bug ([e6a4796](https://github.com/zazuko/data-cube-curation/commit/e6a4796))
* **ui:** show identifier template field for all table types ([25ba2d3](https://github.com/zazuko/data-cube-curation/commit/25ba2d3))
* **ui:** show sources before tables are loaded ([7b474bf](https://github.com/zazuko/data-cube-curation/commit/7b474bf))


### Features

* **ui:** ability to edit a table ([5b3072b](https://github.com/zazuko/data-cube-curation/commit/5b3072b))
* **ui:** add help message on identifier template field ([21b3b86](https://github.com/zazuko/data-cube-curation/commit/21b3b86))
* **ui:** add identifier template on fact table form ([71105d8](https://github.com/zazuko/data-cube-curation/commit/71105d8))





# [0.3.0](https://github.com/zazuko/data-cube-curation/compare/data-cube-curation-ui@0.2.0...data-cube-curation-ui@0.3.0) (2020-03-30)


### Bug Fixes

* **ui:** use relative API URL in docker image ([879b5fa](https://github.com/zazuko/data-cube-curation/commit/879b5fa))
* replace csvw:datetime with csvw:dateTime ([b4a8a7e](https://github.com/zazuko/data-cube-curation/commit/b4a8a7e))
* **ui:** adapt UI to use "propertyTemplate" instead of "predicate" ([cfc1792](https://github.com/zazuko/data-cube-curation/commit/cfc1792))
* **ui:** add baseUri where missing ([ed5e54c](https://github.com/zazuko/data-cube-curation/commit/ed5e54c))
* **ui:** add proper type for "actions" ([50048ef](https://github.com/zazuko/data-cube-curation/commit/50048ef))
* **ui:** api error handling when no details are provided ([fc9beee](https://github.com/zazuko/data-cube-curation/commit/fc9beee))
* **ui:** base URI project for field ([e2ff719](https://github.com/zazuko/data-cube-curation/commit/e2ff719))
* **ui:** browsers without document.execCommand('copy') ([19370c4](https://github.com/zazuko/data-cube-curation/commit/19370c4))
* **ui:** display column mapping after creation ([a1728db](https://github.com/zazuko/data-cube-curation/commit/a1728db))
* **ui:** display message when page does not exist ([732b93b](https://github.com/zazuko/data-cube-curation/commit/732b93b))
* **ui:** do not lowercase table name in identifier field ([595b53c](https://github.com/zazuko/data-cube-curation/commit/595b53c))
* **ui:** don't depend on $refs in computed property ([0050ef1](https://github.com/zazuko/data-cube-curation/commit/0050ef1))
* **ui:** enable one of type/language fields ([3e227b6](https://github.com/zazuko/data-cube-curation/commit/3e227b6))
* **ui:** enforce table max-width ([30b222e](https://github.com/zazuko/data-cube-curation/commit/30b222e))
* **ui:** extract "default" from datatype params ([073bb15](https://github.com/zazuko/data-cube-curation/commit/073bb15))
* **ui:** fix preview loading by using fetch ([35e891d](https://github.com/zazuko/data-cube-curation/commit/35e891d))
* **ui:** improve datatype select box ([dc86e14](https://github.com/zazuko/data-cube-curation/commit/dc86e14))
* **ui:** improve dropdown icons display ([155cd1b](https://github.com/zazuko/data-cube-curation/commit/155cd1b))
* **ui:** improve error handling ([cbe19a8](https://github.com/zazuko/data-cube-curation/commit/cbe19a8))
* **ui:** improve ID template autocomplete matcher ([1f325c5](https://github.com/zazuko/data-cube-curation/commit/1f325c5))
* **ui:** improve Identifier Template validation message ([0992f5e](https://github.com/zazuko/data-cube-curation/commit/0992f5e))
* **ui:** improve project settings tab icon display ([aeb5e1d](https://github.com/zazuko/data-cube-curation/commit/aeb5e1d))
* **ui:** improve projects list display ([9333a23](https://github.com/zazuko/data-cube-curation/commit/9333a23))
* **ui:** increase size of referenced table tag ([17613d3](https://github.com/zazuko/data-cube-curation/commit/17613d3))
* **ui:** infinite loader on API error ([c33a6e3](https://github.com/zazuko/data-cube-curation/commit/c33a6e3))
* **ui:** infinite loading on API errors ([051df94](https://github.com/zazuko/data-cube-curation/commit/051df94))
* **ui:** irregular space ([75907f3](https://github.com/zazuko/data-cube-curation/commit/75907f3))
* **ui:** issue when deleting attribute from table form ([1220a96](https://github.com/zazuko/data-cube-curation/commit/1220a96))
* **ui:** issue with native form validation pattern on Firefox ([f466851](https://github.com/zazuko/data-cube-curation/commit/f466851))
* **ui:** make autofilled identifier template value clearer ([821514d](https://github.com/zazuko/data-cube-curation/commit/821514d))
* **ui:** make error message more friendly ([b67f898](https://github.com/zazuko/data-cube-curation/commit/b67f898))
* **ui:** minor cosmetic changes ([7143fed](https://github.com/zazuko/data-cube-curation/commit/7143fed))
* **ui:** only show "edit" button if operation is there ([31df10b](https://github.com/zazuko/data-cube-curation/commit/31df10b))
* **ui:** only show Source "delete" button if operation exists ([a16fcfb](https://github.com/zazuko/data-cube-curation/commit/a16fcfb))
* **ui:** properly handle attribute dataType ([c3e89f6](https://github.com/zazuko/data-cube-curation/commit/c3e89f6))
* **ui:** reactivity issue when new data is loaded in store ([0597f63](https://github.com/zazuko/data-cube-curation/commit/0597f63))
* **ui:** regression in reference attr. form ([fbe76b8](https://github.com/zazuko/data-cube-curation/commit/fbe76b8))
* **ui:** remove Attribute name ([c6d6fbd](https://github.com/zazuko/data-cube-curation/commit/c6d6fbd))
* **ui:** remove console.error ([032030f](https://github.com/zazuko/data-cube-curation/commit/032030f))
* **ui:** remove extraneous Project.tables ([b82e479](https://github.com/zazuko/data-cube-curation/commit/b82e479))
* **ui:** rename Properties -> Attributes ([deaacf9](https://github.com/zazuko/data-cube-curation/commit/deaacf9))
* **ui:** replace CDN icons by fontawesome dependency ([1ef87b6](https://github.com/zazuko/data-cube-curation/commit/1ef87b6))
* **ui:** replace rdf-ext with @rdfjs/data-model ([775b2a7](https://github.com/zazuko/data-cube-curation/commit/775b2a7))
* **ui:** small typing error ([5d1c8df](https://github.com/zazuko/data-cube-curation/commit/5d1c8df))
* **ui:** suggest hidden sources columns ([6cb6033](https://github.com/zazuko/data-cube-curation/commit/6cb6033))
* **ui:** table form width ([f6f30c1](https://github.com/zazuko/data-cube-curation/commit/f6f30c1))
* **ui:** typeId -> dataTypeId ([76bf2e3](https://github.com/zazuko/data-cube-curation/commit/76bf2e3))
* **ui:** typescript version warning ([57b8e7c](https://github.com/zazuko/data-cube-curation/commit/57b8e7c))
* **ui:** typing issues ([0deafec](https://github.com/zazuko/data-cube-curation/commit/0deafec))
* **ui:** typing issues ([da8b2d8](https://github.com/zazuko/data-cube-curation/commit/da8b2d8))
* **ui:** typo in error handling ([a315e30](https://github.com/zazuko/data-cube-curation/commit/a315e30))
* **ui:** use named nodes in API payloads when appropriate ([6e5b1cb](https://github.com/zazuko/data-cube-curation/commit/6e5b1cb))
* **ui:** wait for reload after deleting a table ([7678ac2](https://github.com/zazuko/data-cube-curation/commit/7678ac2))
* **ui:** weird property field behavior ([1ae8855](https://github.com/zazuko/data-cube-curation/commit/1ae8855))
* have api serve types of project's source collection members ([3819f64](https://github.com/zazuko/data-cube-curation/commit/3819f64))
* include mapped columns in table attribute collection ([250b815](https://github.com/zazuko/data-cube-curation/commit/250b815)), closes [#150](https://github.com/zazuko/data-cube-curation/issues/150)
* rename API attr. operations and use in UI ([c8ed1cc](https://github.com/zazuko/data-cube-curation/commit/c8ed1cc))
* use property template instead of rdf:property ([cc91bc9](https://github.com/zazuko/data-cube-curation/commit/cc91bc9))
* **ui:** use separate type for project form data ([6a6de2f](https://github.com/zazuko/data-cube-curation/commit/6a6de2f))


### Features

* **ui:** ability to create new projects ([14f022c](https://github.com/zazuko/data-cube-curation/commit/14f022c))
* **ui:** ability to delete project ([9f14781](https://github.com/zazuko/data-cube-curation/commit/9f14781))
* **ui:** ability to edit projects ([022e27f](https://github.com/zazuko/data-cube-curation/commit/022e27f))
* **ui:** ability to trigger transform job ([8b4c36b](https://github.com/zazuko/data-cube-curation/commit/8b4c36b))
* **ui:** ability to upload CSV file ([8b027f8](https://github.com/zazuko/data-cube-curation/commit/8b027f8))
* **ui:** add "format" datatype param for numbers ([5cdfb6d](https://github.com/zazuko/data-cube-curation/commit/5cdfb6d))
* **ui:** add a way to get a project's URI ([b0a3ae9](https://github.com/zazuko/data-cube-curation/commit/b0a3ae9))
* **ui:** add buttons to show mapping and data preview ([d3c120a](https://github.com/zazuko/data-cube-curation/commit/d3c120a))
* **ui:** add columns filter on sources page ([889344e](https://github.com/zazuko/data-cube-curation/commit/889344e))
* **ui:** add help text for project base URI field ([943e909](https://github.com/zazuko/data-cube-curation/commit/943e909))
* **ui:** add project settings tab ([3166b1e](https://github.com/zazuko/data-cube-curation/commit/3166b1e))
* **ui:** add references between tables ([1a9fd77](https://github.com/zazuko/data-cube-curation/commit/1a9fd77))
* **ui:** add suggestions to language input field ([8ec518c](https://github.com/zazuko/data-cube-curation/commit/8ec518c))
* **ui:** added graph URI to the transform trigger form ([76f08e2](https://github.com/zazuko/data-cube-curation/commit/76f08e2))
* **ui:** attribute data type with params ([600d3bd](https://github.com/zazuko/data-cube-curation/commit/600d3bd))
* **ui:** auto-complete identifier template columns ([1b8a832](https://github.com/zazuko/data-cube-curation/commit/1b8a832))
* **ui:** auto-complete RDF properties ([ca765f0](https://github.com/zazuko/data-cube-curation/commit/ca765f0))
* **ui:** auto-fill reference column mapping ([d4474e6](https://github.com/zazuko/data-cube-curation/commit/d4474e6))
* **ui:** auto-select first source when creating table ([613f5cf](https://github.com/zazuko/data-cube-curation/commit/613f5cf))
* **ui:** create and display table attributes ([a590cac](https://github.com/zazuko/data-cube-curation/commit/a590cac))
* **ui:** create table and attributes from source columns ([fb60507](https://github.com/zazuko/data-cube-curation/commit/fb60507))
* **ui:** delete attribute ([93dc1ba](https://github.com/zazuko/data-cube-curation/commit/93dc1ba))
* **ui:** delete source ([c190346](https://github.com/zazuko/data-cube-curation/commit/c190346))
* **ui:** delete table ([12de748](https://github.com/zazuko/data-cube-curation/commit/12de748))
* **ui:** display attributes for each source columns ([44f8c25](https://github.com/zazuko/data-cube-curation/commit/44f8c25))
* **ui:** display CSV columns and data ([e66af85](https://github.com/zazuko/data-cube-curation/commit/e66af85))
* **ui:** display shrinked URIs with tooltip ([3ef54df](https://github.com/zazuko/data-cube-curation/commit/3ef54df))
* **ui:** edit CSV source settings ([e831230](https://github.com/zazuko/data-cube-curation/commit/e831230))
* **ui:** highlight type params button when has values ([44afdf2](https://github.com/zazuko/data-cube-curation/commit/44afdf2))
* **ui:** improve mapped data preview display ([072e1d3](https://github.com/zazuko/data-cube-curation/commit/072e1d3))
* **ui:** improve source data display ([004d2bf](https://github.com/zazuko/data-cube-curation/commit/004d2bf))
* **ui:** improve table form display ([6765c33](https://github.com/zazuko/data-cube-curation/commit/6765c33))
* **ui:** improve usability of "reference attribute" form ([a674d13](https://github.com/zazuko/data-cube-curation/commit/a674d13))
* **ui:** improved id template input in simple table form ([925f02c](https://github.com/zazuko/data-cube-curation/commit/925f02c))
* **ui:** list and create tables ([f983e98](https://github.com/zazuko/data-cube-curation/commit/f983e98))
* **ui:** pre-populate attribute predicate from column slug ([79b1b75](https://github.com/zazuko/data-cube-curation/commit/79b1b75))
* **ui:** remove "rules" tab ([0c126fd](https://github.com/zazuko/data-cube-curation/commit/0c126fd))
* **ui:** show full identifier under input field ([c4b768d](https://github.com/zazuko/data-cube-curation/commit/c4b768d))
* **ui:** sort auto-complete data types alphabetically ([7a4e5ec](https://github.com/zazuko/data-cube-curation/commit/7a4e5ec))
* **ui:** use animated loading icon ([8bd39cd](https://github.com/zazuko/data-cube-curation/commit/8bd39cd))
* **ui:** use multiselect for column selector ([c10b2b9](https://github.com/zazuko/data-cube-curation/commit/c10b2b9))
* **ui:** validate identifier template input ([2307e1f](https://github.com/zazuko/data-cube-curation/commit/2307e1f))
* adding reference attribute ([60472d2](https://github.com/zazuko/data-cube-curation/commit/60472d2))





# 0.2.0 (2019-10-31)


### Bug Fixes

* **ui:** add main HTML container ([a2c155d](https://github.com/zazuko/data-cube-curation/commit/a2c155d))
* **ui:** disable exception on missing API_URL ([f5ca4d1](https://github.com/zazuko/data-cube-curation/commit/f5ca4d1))
* **ui:** enable strict mode for store ([dd5b981](https://github.com/zazuko/data-cube-curation/commit/dd5b981))
* **ui:** fix tslint issues ([1074f61](https://github.com/zazuko/data-cube-curation/commit/1074f61))
* **ui:** remove generated example tests ([df6d3e8](https://github.com/zazuko/data-cube-curation/commit/df6d3e8))
* **ui:** switch to ESLint for linting ([dba1cb6](https://github.com/zazuko/data-cube-curation/commit/dba1cb6))
* **ui:** typing and formatting issues ([4a2f682](https://github.com/zazuko/data-cube-curation/commit/4a2f682))
* **ui:** typing issue ([db5bb5b](https://github.com/zazuko/data-cube-curation/commit/db5bb5b))
* **ui:** typing issues ([4a5a0af](https://github.com/zazuko/data-cube-curation/commit/4a5a0af))
* **ui:** typing issues ([ad1ad9e](https://github.com/zazuko/data-cube-curation/commit/ad1ad9e))
* **ui:** ui not updated when loading new projects ([835c8e7](https://github.com/zazuko/data-cube-curation/commit/835c8e7))
* **ui:** use the API in a more "hydra" way ([d168f1c](https://github.com/zazuko/data-cube-curation/commit/d168f1c))


### Features

* **ui:** add ability to upload CSV sources ([14beef9](https://github.com/zazuko/data-cube-curation/commit/14beef9))
* **ui:** add material-design icons ([5f2cae9](https://github.com/zazuko/data-cube-curation/commit/5f2cae9))
* **ui:** add more mapping rules ([34296ca](https://github.com/zazuko/data-cube-curation/commit/34296ca))
* **ui:** add new project data ([9610466](https://github.com/zazuko/data-cube-curation/commit/9610466))
* **ui:** add page that lists projects ([41eb694](https://github.com/zazuko/data-cube-curation/commit/41eb694))
* **ui:** add rule form ([ceca92b](https://github.com/zazuko/data-cube-curation/commit/ceca92b))
* **ui:** add single project page ([f19b2a3](https://github.com/zazuko/data-cube-curation/commit/f19b2a3))
* **ui:** add table form ([f2e49da](https://github.com/zazuko/data-cube-curation/commit/f2e49da))
* **ui:** change app title ([ca17197](https://github.com/zazuko/data-cube-curation/commit/ca17197))
* **ui:** display message on form save ([3d025ff](https://github.com/zazuko/data-cube-curation/commit/3d025ff))
* **ui:** generate Vue.js app with Bulma ([bef9247](https://github.com/zazuko/data-cube-curation/commit/bef9247))
* **ui:** handle projects loading/error states ([4de5390](https://github.com/zazuko/data-cube-curation/commit/4de5390))
* **ui:** improve project sources display ([c8948d7](https://github.com/zazuko/data-cube-curation/commit/c8948d7))
* **ui:** improve projects page display ([7273946](https://github.com/zazuko/data-cube-curation/commit/7273946))
* **ui:** improve sources table display ([7b0823b](https://github.com/zazuko/data-cube-curation/commit/7b0823b))
* **ui:** redirect homepage to projects list ([3cbbd0a](https://github.com/zazuko/data-cube-curation/commit/3cbbd0a))
* **ui:** replace all pages with mockups ([808c4e5](https://github.com/zazuko/data-cube-curation/commit/808c4e5))
* **ui:** transform project tabs into nested views ([5cdc53e](https://github.com/zazuko/data-cube-curation/commit/5cdc53e))

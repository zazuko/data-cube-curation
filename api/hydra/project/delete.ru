PREFIX dataCube: <https://rdf-cube-curation.described.at/>

DELETE WHERE {
    GRAPH <${this.locals.projectId}> {
        ?s ?p ?o
    }
}

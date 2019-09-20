PREFIX dataCube: <https://rdf-cube-curation.described.at/>

DELETE WHERE {
    <${this.locals.projectId}> a dataCube:Project .

    GRAPH <${this.locals.projectId}> {
        ?s ?p ?o
    }
}

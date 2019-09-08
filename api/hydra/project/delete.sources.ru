PREFIX dataCube: <https://rdf-cube-curation.described.at/>

DELETE WHERE {
    GRAPH <${this.locals.projectId}> {
        <${this.locals.projectId}> dataCube:source ?source .
    }

    GRAPH ?source {
        ?s ?p ?o
    }
}

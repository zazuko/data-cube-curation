PREFIX dataCube: <https://rdf-cube-curation.described.at/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

INSERT DATA {
    GRAPH <${this.locals.projectId}> {
        <${this.locals.projectId}>
            a dataCube:Project ;
            <http://schema.org/name> "${projectName.value}" .
    }

    <${this.locals.projectId}> a dataCube:Project .
}

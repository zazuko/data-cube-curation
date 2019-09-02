PREFIX dataCube: <https://rdf-cube-curation.described.at/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

INSERT DATA {
    <${this.locals.projectId}>
        a dataCube:Project ;
        <http://schema.org/name> "${projectName.value}" .
}

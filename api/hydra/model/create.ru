PREFIX dataCube: <https://rdf-cube-curation.described.at/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

INSERT DATA {
    <${this.locals.modelId}>
        a dataCube:Model ;
        <http://schema.org/name> "${modelName.value}" .
}

PREFIX dataCube: <https://rdf-cube-curation.described.at/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX schema: <http://schema.org/>

INSERT DATA {
    <${this.locals.projectId}> dataCube:source <${this.locals.sourceId}> .
    <${this.locals.sourceId}> dataCube:project <${this.locals.projectId}> .

    <${this.locals.sourceId}>
        a dataCube:Source, dataCube:CsvSource ;
        <http://schema.org/name> "${this.locals.sourceName}" .

    ${this.locals.columns.map(column => `
        <${column.id}>
            a dataCube:Column ;
            schema:name "${column.title}" .

     <${this.locals.sourceId}> dataCube:column <${column.id}> .`).join('')}

}

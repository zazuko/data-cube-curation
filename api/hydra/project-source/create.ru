BASE <https://rdf-cube-curation.described.at/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

INSERT DATA {
    <${this.locals.modelId}> <DataCubeModel/source> <${this.locals.sourceId}> .

    <${this.locals.sourceId}>
        a <DataCubeSource> ;
        <http://schema.org/name> "${this.locals.sourceName}" .

    ${this.locals.columns.map(column => `
        <${column.id}>
            a <DataCubeSourceColumn> ;
            <DataCubeSourceColumn/mapped> false ;
            <DataCubeSourceColumn/title> "${column.title}" .

     <${this.locals.sourceId}> <DataCubeSource/column> <${column.id}> .`).join('')}

}

BASE <https://rdf-cube-curation.described.at/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>

INSERT DATA {
    <${this.locals.projectId}>
        a <DataCubeProject> ;
        <DataCubeProject/columns> <${this.locals.projectId}/columns> ;
        <http://schema.org/name> "Untitled Data Cube project" .

    <${this.locals.projectId}/columns> hydra:totalItems ${this.locals.columns.length} ;
                                       a hydra:Collection .

    ${this.locals.columns.map(column => `
        <${column.id}>
            a <DataCubeColumn> ;
            <DataCubeColumn/mapped> false ;
            <DataCubeColumn/title> "${column.title}" .

        <${this.locals.projectId}/columns> hydra:member <${column.id}>`).join('')}
}

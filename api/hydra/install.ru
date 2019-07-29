BASE <${this.env.BASE_URI}>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>
PREFIX api: <https://rdf-cube-curation.described.at/api#>

INSERT DATA {
    <> rdf:type api:Entrypoint ;
       hydra:title "Data Cube Curation" ;
       api:dataCubeProjects <projects> .

    <projects> a api:DataCubeProjects .
}

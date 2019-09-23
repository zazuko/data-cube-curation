PREFIX dataCube: <https://rdf-cube-curation.described.at/>

DELETE {
  	GRAPH ?factTable {
    	?s ?p ?o
 	}
} WHERE {
    GRAPH ?factTable {
        ?factTable a dataCube:Table .
        ?factTable dataCube:project <${this.locals.projectId}> .
    }
}

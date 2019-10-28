export default [
  {
    id: 'dfe46722-3b54-41b8-ac4a-811760b2a420',
    name: 'Bus registrations',
    sources: [
      {
        id: '1',
        name: 'Registrations.csv',
        columns: [
          { label: 'MAKE', field: 'make' },
          { label: 'MODEL', field: 'model' },
          { label: 'Municipality', field: 'municipality' },
          { label: 'Operator', field: 'operator' },
          { label: 'Registered', field: 'registered' },
          { label: 'Length', field: 'length' },
          { label: 'Kind', field: 'kind' },
          { label: 'Year', field: 'year' },
          { label: 'Month', field: 'month' },
          { label: 'Canton', field: 'canton' }
        ],
        data: [
          { make: 'MAN', model: 'Lion\'s City', municipality: '122', operator: 'Bernmobil', registered: '10', length: '12', kind: 'city', year: '2019', month: '8', canton: 'ZH' },
          { make: 'MAN', model: 'Lion\'s City', municipality: '122', operator: 'Bernmobil', registered: '10', length: '12', kind: 'city', year: '2019', month: '8', canton: 'ZH' },
          { make: 'MAN', model: 'Lion\'s City', municipality: '122', operator: 'Bernmobil', registered: '10', length: '12', kind: 'city', year: '2019', month: '8', canton: 'ZH' }
        ]
      }
    ],
    tables: [
      {
        id: 'vehicle',
        name: 'Vehicle',
        color: '#ea9999',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'veh:length', type: 'xsd:int' },
          { name: 'veh:kind', type: 'Kind' }
        ]
      },
      {
        id: 'municipality',
        name: 'Municipality',
        color: '#fff2cc',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'skos:broader', type: 'Canton' }
        ]
      },
      {
        id: 'operator',
        name: 'Operator',
        color: '#d9d2e9',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'ex:location', type: 'Municipality' }
        ]
      },
      {
        id: 'canton',
        name: 'Canton',
        color: '#46bdc6',
        properties: [
          { name: 'Identifier', type: null }
        ]
      },
      {
        id: 'registered',
        name: 'Registered',
        color: '#d9ead3',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'reg:vehicle', type: 'Vehicle' },
          { name: 'reg:operator', type: 'Operator' },
          { name: 'reg:count', type: 'xsd:int' },
          { name: 'reg:when', type: 'xsd:gYearMonth' }
        ]
      }
    ],
    rules: [
      {
        table: 'vehicle',
        property: 'Identifier',
        columns: ['make', 'model'],
        transform: '</{make}/{model}>'
      },
      {
        table: 'vehicle',
        property: 'veh:length',
        columns: ['length'],
        transform: ''
      },
      {
        table: 'vehicle',
        property: 'veh:kind',
        columns: ['kind'],
        transform: '</but-type/{kind}>'
      },

      {
        table: 'municipality',
        property: 'Identifier',
        columns: ['municipality'],
        transform: '</counties/{municipality}>'
      },
      {
        table: 'municipality',
        property: 'skos:broader',
        columns: ['canton'],
        transform: '</canton/{canton}>'
      },

      {
        table: 'operator',
        property: 'Identifier',
        columns: ['operator'],
        transform: '</operators/{operator}>'
      },
      {
        table: 'operator',
        property: 'ex:location',
        columns: ['municipality'],
        transform: '</counties/{municipality}>'
      },

      {
        table: 'canton',
        property: 'Identifier',
        columns: ['canton'],
        transform: '</canton/{canton}>'
      },

      {
        table: 'registered',
        property: 'Identifier',
        columns: ['make', 'model', 'operator'],
        transform: '</registration/{make}/{model}/{operator}>'
      },
      {
        table: 'registered',
        property: 'reg:vehicle',
        columns: ['make', 'model'],
        transform: '</{make}/{model}>'
      },
      {
        table: 'registered',
        property: 'reg:operator',
        columns: ['operator'],
        transform: '</operators/{operator}>'
      },
      {
        table: 'registered',
        property: 'reg:count',
        columns: ['registered'],
        transform: ''
      },
      {
        table: 'registered',
        property: 'reg:when',
        columns: ['month', 'year'],
        transform: '{month}-{year}'
      }
    ].map((rule, index) => ({
      ...rule,
      id: index.toString()
    }))
  },

  {
    id: '7a3ff67b-34ac-40cb-95a5-bd1fce8d34cd',
    name: 'Bafu UBD',
    sources: [
      {
        id: '1',
        name: 'UBD0028.Daten_de-sample.csv',
        columns: [
          { label: 'station_id', field: 'station_id' },
          { label: 'station_name', field: 'station_name' },
          { label: 'station_measuring_network', field: 'station_measuring_network' },
          { label: 'station_canton', field: 'station_canton' },
          { label: 'station_y', field: 'station_y' },
          { label: 'station_x', field: 'station_x' },
          { label: 'station_E', field: 'station_E' },
          { label: 'station_N', field: 'station_N' },
          { label: 'station_altitude', field: 'station_altitude' },
          { label: 'area_type_de', field: 'area_type_de' },
          { label: 'station_type_de', field: 'station_type_de' },
          { label: 'pollutant_name_de', field: 'pollutant_name_de' },
          { label: 'pollutant_description_de', field: 'pollutant_description_de' },
          { label: 'aggregation_name_de', field: 'aggregation_name_de' },
          { label: 'limitvalue', field: 'limitvalue' },
          { label: 'year', field: 'year' },
          { label: 'value', field: 'value' },
          { label: 'unit_name_de', field: 'unit_name_de' },
          { label: 'value_remark', field: 'value_remark' }
        ],
        data: [
          { station_id: 'agAAR', station_name: 'Aarau', station_measuring_network: 'AG', station_canton: 'AG', station_y: '646350', station_x: '249400', station_E: '2646350', station_N: '1249400', station_altitude: '383', area_type_de: 'Städtisch', station_type_de: 'Verkehr', pollutant_name_de: 'NO2', pollutant_description_de: 'Stickstoffdioxid', aggregation_name_de: '95%-Wert der 1/2h-Mittel', limitvalue: '100', year: '1986', value: '80,1', unit_name_de: 'µg/m3', value_remark: '' },
          { station_id: 'agAAR', station_name: 'Aarau', station_measuring_network: 'AG', station_canton: 'AG', station_y: '646350', station_x: '249400', station_E: '2646350', station_N: '1249400', station_altitude: '383', area_type_de: 'Städtisch', station_type_de: 'Verkehr', pollutant_name_de: 'NO2', pollutant_description_de: 'Stickstoffdioxid', aggregation_name_de: '95%-Wert der 1/2h-Mittel', limitvalue: '100', year: '1987', value: '51,3', unit_name_de: 'µg/m3', value_remark: '' },
          { station_id: 'agAAR', station_name: 'Aarau', station_measuring_network: 'AG', station_canton: 'AG', station_y: '646350', station_x: '249400', station_E: '2646350', station_N: '1249400', station_altitude: '383', area_type_de: 'Städtisch', station_type_de: 'Verkehr', pollutant_name_de: 'NO2', pollutant_description_de: 'Stickstoffdioxid', aggregation_name_de: '95%-Wert der 1/2h-Mittel', limitvalue: '100', year: '1988', value: '49,3', unit_name_de: 'µg/m3', value_remark: '' }
        ]
      }
    ],
    tables: [
      {
        id: 'Facts',
        name: 'Facts',
        color: '#d9ead3',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'ubd:station', type: 'Station' },
          { name: 'ubd:area', type: 'Area' },
          { name: 'ubd:pollutant', type: 'Pollutant' },
          { name: 'ubd:year', type: 'xsd:gYear' },
          { name: 'ubd:value', type: 'xsd:float' }
        ]
      },
      {
        id: 'Station',
        name: 'Station',
        color: '#46bdc6',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'rdfs:label', type: 'xsd:string' },
          { name: 'ubd:canton', type: 'xsd:string' },
          { name: 'ubd:x', type: 'xsd:int' },
          { name: 'ubd:y', type: 'xsd:int' },
          { name: 'ubd:E', type: 'xsd:int' },
          { name: 'ubd:N', type: 'xsd:int' },
          { name: 'ubd:altitude', type: 'xsd:int' },
          { name: 'ubd:measuring_network', type: 'xsd:string' },
          { name: 'ubd:type', type: 'xsd:string' }
        ]
      },
      {
        id: 'Area',
        name: 'Area',
        color: '#d9d2e9',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'rdfs:label', type: 'xsd:string' }
        ]
      },
      {
        id: 'Pollutant',
        name: 'Pollutant',
        color: '#fff2cc',
        properties: [
          { name: 'Identifier', type: null },
          { name: 'rdfs:label', type: 'xsd:string' },
          { name: 'rdfs:comment', type: 'xsd:string' }
        ]
      }
    ],
    rules: [
      {
        table: 'Facts',
        property: 'udb:station',
        columns: ['station_id'],
        transform: '</stations/{station_id}>'
      },
      {
        table: 'Facts',
        property: 'udb:area',
        columns: ['area_type_de'],
        transform: '</areas/{area_type_de}>'
      },
      {
        table: 'Facts',
        property: 'udb:pollutant',
        columns: ['pollutant_name_de'],
        transform: '</pollutants/{pollutant_name_de}>'
      },
      {
        table: 'Facts',
        property: 'udb:year',
        columns: ['year'],
        transform: ''
      },
      {
        table: 'Facts',
        property: 'udb:value',
        columns: ['value'],
        transform: ''
      },

      {
        table: 'Station',
        property: 'Identifier',
        columns: ['station_id'],
        transform: '</stations/{station_id}>'
      },
      {
        table: 'Station',
        property: 'rdfs:label',
        columns: ['station_name'],
        transform: ''
      },

      {
        table: 'Area',
        property: 'Identifier',
        columns: ['area_type_de'],
        transform: '</areas/{area_type_de}>'
      },

      {
        table: 'Pollutant',
        property: 'Identifier',
        columns: ['pollutant_name_de'],
        transform: '</pollutants/{pollutant_name_de}>'
      },
      {
        table: 'Pollutant',
        property: 'rdfs:label',
        columns: ['pollutant_name_de'],
        transform: ''
      },
      {
        table: 'Pollutant',
        property: 'rdfs:comment',
        columns: ['pollutant_description_de'],
        transform: ''
      }
    ].map((rule, index) => ({
      ...rule,
      id: index.toString()
    }))
  }
]

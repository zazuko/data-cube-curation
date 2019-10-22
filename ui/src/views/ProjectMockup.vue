<template>
  <div id="project-page">
    <h2 class="title is-2">{{ project.name }}</h2>

    <b-tabs v-model="activeTab">
      <b-tab-item label="Input data">
        <TabData :sources="project.sources" :rules="rules" :tables="tables" />
      </b-tab-item>

      <b-tab-item label="Output tables">
        <TabTables :tables="tables" />
      </b-tab-item>

      <b-tab-item label="Mapping rules">
        <TabRules :sources="project.sources" :rules="rules" :tables="tables" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Project, RemoteData } from '../types';
import TabData from '../components/project/TabData.vue';
import TabTables from '../components/project/TabTables.vue';
import TabRules from '../components/project/TabRules.vue';


@Component({
  components: {
    TabData,
    TabTables,
    TabRules,
  },
})
export default class ProjectView extends Vue {
  activeTab = 2;

  project = {
    id: 'dfe46722-3b54-41b8-ac4a-811760b2a420',
    name: 'Bus registrations',
    sources: [
      {
        id: '1',
        name: 'Registrations.csv',
        columns: [
          {label: 'MAKE', field: 'make'},
          {label: 'MODEL', field: 'model'},
          {label: 'Municipality', field: 'municipality'},
          {label: 'Operator', field: 'operator'},
          {label: 'Registered', field: 'registered'},
          {label: 'Length', field: 'length'},
          {label: 'Kind', field: 'kind'},
          {label: 'Year', field: 'year'},
          {label: 'Month', field: 'month'},
          {label: 'Canton', field: 'canton'},
        ],
        data: [
          {make: 'MAN', model: 'Lion\'s City', municipality: '122', operator: 'Bernmobil', registered: '10', length: '12', kind: 'city', year: '2019', month: '8', canton: 'ZH'},
          {make: 'MAN', model: 'Lion\'s City', municipality: '122', operator: 'Bernmobil', registered: '10', length: '12', kind: 'city', year: '2019', month: '8', canton: 'ZH'},
          {make: 'MAN', model: 'Lion\'s City', municipality: '122', operator: 'Bernmobil', registered: '10', length: '12', kind: 'city', year: '2019', month: '8', canton: 'ZH'},
        ],
      },
    ],
  };

  tables = [
    {
      id: 'vehicle',
      name: 'Vehicle',
      color: '#ea9999',
      properties: [
        {name: 'Identifier'},
        {name: 'veh:length', type: 'xsd:int'},
        {name: 'veh:kind', type: 'Kind'},
      ],
    },
    {
      id: 'municipality',
      name: 'Municipality',
      color: '#fff2cc',
      properties: [
        {name: 'Identifier'},
        {name: 'skos:broader', type: 'Canton'},
      ],
    },
    {
      id: 'operator',
      name: 'Operator',
      color: '#d9d2e9',
      properties: [
        {name: 'Identifier'},
        {name: 'ex:location', type: 'Municipality'},
      ],
    },
    {
      id: 'canton',
      name: 'Canton',
      color: '#46bdc6',
      properties: [
        {name: 'Identifier'},
      ],
    },
    {
      id: 'registered',
      name: 'Registered',
      color: '#d9ead3',
      properties: [
        {name: 'Identifier'},
        {name: 'reg:vehicle', type: 'Vehicle'},
        {name: 'reg:operator', type: 'Operator'},
        {name: 'reg:count', type: 'xsd:int'},
        {name: 'reg:when', type: 'xsd:gYearMonth'},
      ],
    },
  ];

  rules = [
    {
      table: 'vehicle',
      property: 'Identifier',
      columns: ['make', 'model'],
      transform: '</{make}/{model}>',
    },
    {
      table: 'vehicle',
      property: 'veh:length',
      columns: ['length'],
      transform: '',
    },
    {
      table: 'vehicle',
      property: 'veh:kind',
      columns: ['kind'],
      transform: '</but-type/{kind}>',
    },

    {
      table: 'municipality',
      property: 'Identifier',
      columns: ['municipality'],
      transform: '</counties/{municipality}>',
    },
    {
      table: 'municipality',
      property: 'skos:broader',
      columns: ['canton'],
      transform: '</canton/{canton}>',
    },

    {
      table: 'operator',
      property: 'Identifier',
      columns: ['operator'],
      transform: '</operators/{operator}>',
    },
    {
      table: 'operator',
      property: 'ex:location',
      columns: ['municipality'],
      transform: '</counties/{municipality}>',
    },

    {
      table: 'canton',
      property: 'Identifier',
      columns: ['canton'],
      transform: '</canton/{canton}>',
    },

    {
      table: 'registered',
      property: 'Identifier',
      columns: ['make', 'model', 'operator'],
      transform: '</registration/{make}/{model}/{operator}>',
    },
    {
      table: 'registered',
      property: 'reg:vehicle',
      columns: ['make', 'model'],
      transform: '</{make}/{model}>',
    },
    {
      table: 'registered',
      property: 'reg:operator',
      columns: ['operator'],
      transform: '</operators/{operator}>',
    },
    {
      table: 'registered',
      property: 'reg:count',
      columns: ['registered'],
      transform: '',
    },
    {
      table: 'registered',
      property: 'reg:when',
      columns: ['month', 'year'],
      transform: '{month}-{year}',
    },
  ].map((rule, index) => ({
    ...rule,
    id: index,
  }));
}
</script>

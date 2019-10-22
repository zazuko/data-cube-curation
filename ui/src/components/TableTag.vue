<template>
  <b-tag :style="{'background-color': table.color}">
    {{ table.name }}
  </b-tag>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Table } from '../types';


@Component
export default class TabRules extends Vue {
  @Prop() readonly table: Table;
}
</script>

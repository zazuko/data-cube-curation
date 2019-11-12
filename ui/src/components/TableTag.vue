<template>
  <b-tag :style="{'background-color': table.color}">
    <slot>{{ table.name }}</slot>
  </b-tag>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Table } from '../types'

@Component
export default class extends Vue {
  @Prop() readonly table: Table;
}
</script>

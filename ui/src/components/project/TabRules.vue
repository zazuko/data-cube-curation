<template>
  <div class="mapping-rules">
    <b-field>
      <b-button type="is-primary" icon-left="plus">
        Add rule
      </b-button>
    </b-field>

    <b-table :data="rules">
      <template slot-scope="props">
        <b-table-column label="Data column(s)">
          {{ props.row.columns.join(', ') }}
        </b-table-column>
        <b-table-column label="Target table">
          <TableTag :table="getTable(props.row.table)" />
        </b-table-column>
        <b-table-column label="Target property">
          {{ props.row.property }}
        </b-table-column>
        <b-table-column label="Transform">
          {{ props.row.transform }}
        </b-table-column>
        <b-table-column label="">
          <div class="buttons has-addons">
            <b-button icon-left="pencil" class="is-small"></b-button>
            <b-button icon-left="trash-can-outline" class="is-small"></b-button>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import TableTag from '../TableTag.vue';
import { Table, Rule, Source } from '../../types';


@Component({
  components: {
    TableTag,
  },
})
export default class TabRules extends Vue {
  @Prop({ default: [] }) readonly tables: Table[];
  @Prop({ default: [] }) readonly rules: Rule[];
  @Prop({ default: [] }) readonly sources: Source[];

  getTable(tableId: string) {
    return this.tables.find((table) => table.id === tableId);
  }
}
</script>

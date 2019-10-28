<template>
  <form action="" class="modal-card" @submit="save">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ title }}</h3>
    </header>
    <section class="modal-card-body">
      <b-field label="Source columns">
        <b-taginput
          v-model="rule.columns"
          autocomplete
          :data="columns"
          field="compositeName"
          open-on-focus />
      </b-field>

      <b-field label="Target table">
        <b-autocomplete
          v-model="rule.table"
          :data="tables"
          field="id"
          open-on-focus>
          <template slot-scope="props">
            <TableTag :table="props.option" />
          </template>
        </b-autocomplete>
      </b-field>

      <b-field label="Target property">
        <b-autocomplete
          v-model="rule.property"
          :data="getTableProperties(rule.table)"
          field="name"
          :disabled="!rule.table"
          open-on-focus>
        </b-autocomplete>
      </b-field>

      <b-field label="Transform">
        <b-input :value="rule.transform" />
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Table, Rule, Source } from '../../types';
import TableTag from '../TableTag.vue';


@Component({
  components: {
    TableTag,
  },
})
export default class TableForm extends Vue {
  @Prop({ default: emptyRule }) readonly rule: Rule;
  @Prop({ default: () => [] }) readonly tables: Table[];
  @Prop({ default: () => [] }) readonly sources: Source[];

  get columns() {
    return this.sources.flatMap((source) => {
      return source.columns.map((column) => ({
        ...column,
        compositeName: `${source.name} / ${column.field}`,
      }));
    });
  }

  get title() {
    if (this.rule.id) {
      return 'Edit rule';
    } else {
      return 'Create rule';
    }
  }

  getTableProperties(tableId: string) {
    const table = this.tables.find(({ id }) => id === tableId);

    if (!table) { return []; }

    return table.properties;
  }

  save() {
    this.$buefy.dialog.alert({
      message: 'Not implemeted yet',
    });
  }
}

function emptyRule() {
  return {
    id: '',
    columns: [],
    table: '',
    property: '',
    transform: '',
  };
}
</script>

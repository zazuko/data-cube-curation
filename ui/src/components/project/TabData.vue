<template>
  <div class="input-data">
    <b-field class="file">
      <b-upload @input="uploadSource" accept=".csv">
        <a class="button is-primary">
          <b-icon icon="upload"></b-icon>
          <span>Upload CSV</span>
        </a>
      </b-upload>
    </b-field>

    <div v-for="source in sources" :key="source.id">
      <article class="card project-source">
        <header class="card-header">
          <h2 class="card-header-title">{{ source.name }}</h2>
          <b-button icon-left="trash-can-outline"></b-button>
        </header>
        <section class="">
          <b-table
            :data="source.data"
            bordered
            striped
            narrowed
            hoverable
          >
            <template slot="empty">File is empty</template>
            <template slot-scope="props">
              <b-table-column v-for="(column, index) in source.columns" :key="index" :field="column.field" :label="column.label">
                <template slot="header">
                  {{ column.label }}
                  <b-taglist>
                    <TableTag v-for="rule in columnRules(column)" :key="rule.id" :table="rule.table" />
                  </b-taglist>
                </template>
                {{ props.row[column.field] }}
              </b-table-column>
            </template>
          </b-table>
        </section>
        <footer class="card-footer">
          <b-button icon-right="chevron-double-down" class="is-fullwidth">
            Show more
          </b-button>
        </footer>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import TableTag from '../TableTag.vue';
import { Rule, Table, Source } from '../../types';

@Component({
  components: {
    TableTag,
  },
})
export default class TabData extends Vue {
  @Prop({ default: [] }) readonly sources: Source[];
  @Prop({ default: [] }) readonly rules: Rule[];
  @Prop({ default: [] }) readonly tables: Table[];

  uploadSource() {}

  columnRules(column: any) {
    const columnId = column.field;
    const rules = this.rules.filter((rule) => rule.columns.includes(columnId));
    return rules.map((rule) => {
      const table = this.tables.find((table: any) => table.id === rule.table);
      return {
        ...rule,
        table: table,
      };
    });
  }

}
</script>

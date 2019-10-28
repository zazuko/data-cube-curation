<template>
  <div class="mapping-rules">
    <b-field>
      <b-button type="is-primary" icon-left="plus" @click="createRule">
        Add rule
      </b-button>
    </b-field>

    <b-table :data="project.rules">
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
            <b-button icon-left="pencil" class="is-small" @click="editRule(props.row)" />
            <b-button icon-left="trash-can-outline" class="is-small" />
          </div>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Project, ProjectId, Table, Rule, Source } from '../../types';
import TableTag from '../../components/TableTag.vue';
import RuleForm from '../../components/project/RuleForm.vue';


@Component({
  components: {
    TableTag,
    RuleForm,
  },
})
export default class ProjectRulesView extends Vue {
  get projectId(): ProjectId {
    return this.$route.params.id;
  }

  get project(): Project {
    return this.$store.getters['projectsFixtures/one'](this.projectId);
  }

  getTable(tableId: string) {
    return this.project.tables.find((table) => table.id === tableId);
  }

  createRule() {
    this.$buefy.modal.open({
      parent: this,
      component: RuleForm,
      props: {
        tables: this.project.tables,
        sources: this.project.sources,
      },
      hasModalCard: true,
    });
  }

  editRule(rule: Rule) {
    this.$buefy.modal.open({
      parent: this,
      component: RuleForm,
      props: {
        rule: rule,
        tables: this.project.tables,
        sources: this.project.sources,
      },
      hasModalCard: true,
    });
  }
}
</script>

<template>
  <div class="output-tables">
    <div class="buttons" v-if="project.actions.createDimensionTable || project.actions.createFactTable">
      <b-button type="is-primary" icon-left="plus" @click="createTable">
        Create table
      </b-button>
    </div>

    <Loader :data="sources" v-slot="{ data: sources }">
      <Loader class="tables-list" :data="tables" v-slot="{ data: tables }">
        <TableItem v-for="table in tables" :key="table.id" :table="table" :project="project" :tables="tables" :sources="sources" />
        <div v-if="tables.length < 1" class="content has-text-grey">
          <p>No table yet</p>
        </div>
      </Loader>
    </Loader>
  </div>
</template>

<style scoped>
  .tables-list > .card {
    margin-bottom: 1rem;
  }

  .tables-list > .card > .card-content {
    overflow-x: scroll;
  }

  .tables-list > .card > .card-footer {
    display: flex;
    justify-content: flex-end;
  }

  .tables-list > .card > .card-footer > .buttons > .button {
    border: none;
    border-radius: 0;
  }
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Project, ResourceId, Table, RemoteData, TableFormData } from '@/types'
import Loader from '../../components/Loader.vue'
import TableItem from '../../components/project/TableItem.vue'
import TableForm from '../../components/project/TableForm.vue'

@Component({
  components: {
    TableItem,
    TableForm,
    Loader
  }
})
export default class ProjectTablesView extends Vue {
  get project (): Project {
    const projectId = this.$route.params.id
    const remoteProject = this.$store.getters['projects/one'](projectId)
    // Assume project is loaded because we're in a nested view
    return remoteProject.data
  }

  get tables (): RemoteData<Table[]> {
    return this.$store.getters['tables/forProject'](this.project.id)
  }

  get sources (): RemoteData<Table[]> {
    return this.$store.getters['sources/forProject'](this.project.id)
  }

  createTable () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: TableForm,
      props: {
        project: this.project,
        sources: this.sources.data, // TODO: Handle loading?
        save: async (table: TableFormData) => {
          const loading = this.$buefy.loading.open({})
          await this.$store.dispatch('tables/create', { project: this.project, table })
          loading.close()
          modal.close()
        }
      },
      hasModalCard: true
    })
  }

  editTable (table: Table) {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: TableForm,
      props: {
        project: this.project,
        sources: this.sources.data, // TODO: Handle loading?
        table,
        save: (table: TableFormData) => {
          modal.close()
        }
      },
      hasModalCard: true
    })
  }

  deleteTable (table: Table) {
    this.$buefy.dialog.confirm({
      title: 'Delete table',
      message: 'Are you sure you want to delete this table?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        const loading = this.$buefy.loading.open({})
        await this.$store.dispatch('tables/delete', table)
        loading.close()
      }
    })
  }
}

</script>

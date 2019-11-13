<template>
  <div class="output-tables">
    <div class="buttons" v-if="project.actions.createDimensionTable || project.actions.createFactTable">
      <b-button type="is-primary" icon-left="plus" @click="createTable">
        Create table
      </b-button>
    </div>

    <Loader class="tables-list" :data="tables" v-slot="{ data: tables }">
      <article class="card" v-for="table in tables" :key="table.id">
        <header class="card-header" :style="{'background-color': table.color}">
          <h3 class="card-header-title">{{ table.name }}</h3>
          <span class="card-header-icon" v-if="table.isFact"><b-tag>Fact table</b-tag></span>
        </header>
        <section class="card-content">
          <p v-if="!table.isFact">
            Identifier template: <code>{{ table.identifierTemplate }}</code>
          </p>

          <h4 class="is-4">Properties:</h4>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Source column</th>
                <th>Property</th>
                <th>Type</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="attribute in table.attributes" :key="attribute.id">
                <td>{{ attribute.name }}</td>
                <td>{{ attribute.column }}</td>
                <td>{{ attribute.predicate }}</td>
                <td>{{ attribute.type }}</td>
                <td>{{ attribute.language }}</td>
              </tr>
              <tr v-if="table.attributes.length < 1">
                <td colspan="6" class="has-text-grey">No properties yet</td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer class="card-footer">
          <div class="buttons has-addons">
            <b-button icon-left="pencil" v-if="table.actions.edit" @click="editTable(table)" />
            <b-button icon-left="trash-can-outline" v-if="table.actions.delete" @click="deleteTable(table)" />
          </div>
        </footer>
      </article>

      <div v-if="tables.length < 1" class="content has-text-grey">
        <p>No table yet</p>
      </div>
    </Loader>
  </div>
</template>

<style scoped>
  .tables-list {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .tables-list > .card {
    margin-right: 1rem;
    margin-bottom: 1rem;
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
import { Project, ResourceId, Table, RemoteData } from '@/types'
import Loader from '../../components/Loader.vue'
import TableForm from '../../components/project/TableForm.vue'

@Component({
  components: {
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

  created () {
    this.$store.dispatch('tables/loadForProject', this.project)
  }

  get tables (): RemoteData<Table[]> {
    return this.$store.getters['tables/forProject'](this.project.id)
  }

  createTable () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: TableForm,
      props: {
        project: this.project,
        save: (table: Table) => {
          this.$store.dispatch('tables/create', { project: this.project, table })
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
        table,
        save: (table: Table) => {
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
      onConfirm: () => {
        this.$store.dispatch('tables/delete', table)
      }
    })
  }
}

</script>

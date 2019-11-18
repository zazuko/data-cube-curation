<template>
  <article class="card">
    <header class="card-header" :style="{'background-color': table.color}">
      <h3 class="card-header-title">{{ table.name }}</h3>
      <span class="card-header-icon" v-if="table.isFact"><b-tag>Fact table</b-tag></span>
    </header>
    <section class="card-content">
      <table class="table is-fullwidth">
        <tbody>
          <tr>
            <th>Source CSV</th>
            <Loader tag="td" :data="source" v-slot="{ data: source }">{{ source.name }}</Loader>
          </tr>
          <tr v-if="!table.isFact">
            <th>Identifier template</th>
            <td><code>{{ table.identifierTemplate }}</code></td>
          </tr>
          <tr v-if="table.attributesCollection">
            <th>Properties</th>
            <td>

              <table class="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Source column</th>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Language</th>
                    <th></th>
                  </tr>
                </thead>
                <Loader tag="tbody" :data="attributes" v-slot="{ data: attributes }">
                  <tr v-for="attribute in attributes" :key="attribute.id">
                    <td>{{ attribute.name }}</td>
                    <Loader tag="td" :data="getColumn(attribute.columnId)" v-slot="{ data: column }">
                      {{ column.name }}
                    </Loader>
                    <td>{{ attribute.predicateId }}</td>
                    <td>{{ attribute.type }}</td>
                    <td>{{ attribute.language }}</td>
                    <td>
                      <b-button v-if="attribute.actions.delete" icon="trash-can-outline" />
                      <b-button v-if="attribute.actions.edit" icon="pencil" />
                    </td>
                  </tr>
                  <tr v-if="attributes.length < 1">
                    <td colspan="7" class="has-text-grey">No properties yet</td>
                  </tr>
                </Loader>
                <tfoot>
                  <tr>
                    <td colspan="7" v-if="table.actions.createAttribute" class="has-text-right">
                      <b-button icon-left="plus" @click="createAttribute">
                        {{ table.actions.createAttribute.title }}
                      </b-button>
                    </td>
                  </tr>
                </tfoot>
              </table>

            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <footer class="card-footer">
      <div class="card-actions">
        <b-button type="is-white" icon-left="pencil" v-if="table.actions.edit" @click="editTable(table)" :title="table.actions.edit.title" />
        <b-button type="is-white" icon-left="trash-can-outline" v-if="table.actions.delete" @click="deleteTable(table)" :title="table.actions.delete.title" />
      </div>
    </footer>
  </article>
</template>

<style scoped>
.card-content {
  padding: 0;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Project, ResourceId, Table, Source, RemoteData, Attribute, Column } from '@/types'
import Remote from '@/remote'
import Loader from '@/components/Loader.vue'
import AttributeForm from './AttributeForm.vue'

@Component({
  components: {
    Loader
  }
})
export default class extends Vue {
  @Prop() readonly project: Project
  @Prop() readonly table: Table

  get attributes () {
    return this.$store.getters['attributes/forTable'](this.table.id)
  }

  get source (): RemoteData<Source> {
    const projectId = this.$route.params.id
    return this.$store.getters['sources/one'](projectId, this.table.sourceId)
  }

  getColumn (id: ResourceId): RemoteData<Column> {
    if (this.source.isLoading || !this.source.data) {
      return Remote.loading()
    }

    const column = this.source.data.columns.find((column: Column) => column.id === id)

    return Remote.loaded(column)
  }

  deleteTable (table: Table) {
    this.$buefy.dialog.confirm({
      title: this.table.actions.delete.title,
      message: 'Are you sure you want to delete this table?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => {
        this.$store.dispatch('tables/delete', { project: this.project, table: this.table })
      }
    })
  }

  createAttribute () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: AttributeForm,
      props: {
        table: this.table,
        // TODO: Handle source not loaded
        source: this.source.data,
        save: (attribute: Attribute) => {
          this.$store.dispatch('attributes/create', { table: this.table, attribute })
          modal.close()
        }
      },
      hasModalCard: true
    })
  }
}
</script>

<template>
  <article class="card">
    <header class="card-header" :style="{'background-color': table.color}">
      <h3 class="card-header-title">{{ table.name }}</h3>
      <div class="card-header-icon">
        <b-tag v-if="table.isFact">Fact table</b-tag>

        <b-dropdown position="is-bottom-left">
          <button class="button is-text" slot="trigger">
            <b-icon icon="dots-horizontal"></b-icon>
          </button>
          <b-dropdown-item v-if="table.mapping" @click="showMapping(table)">
            View mapping
          </b-dropdown-item>
          <b-dropdown-item v-if="table.preview" @click="showPreview(table)">
            Preview mapped data
          </b-dropdown-item>
          <hr class="dropdown-divider">
          <b-dropdown-item v-if="table.actions.edit" @click="editTable(table)">
            <b-icon icon="pencil" />
            {{ table.actions.edit.title }}
          </b-dropdown-item>
          <b-dropdown-item v-if="table.actions.delete" @click="deleteTable(table)" class="has-text-danger">
            <b-icon icon="trash-can-outline" />
            {{ table.actions.delete.title }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
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
                    <th>Source column</th>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Language</th>
                    <th></th>
                  </tr>
                </thead>
                <Loader tag="tbody" :data="attributes" v-slot="{ data: attributes }">
                  <tr v-for="attribute in attributes" :key="attribute.id">
                    <Loader tag="td" :data="getColumn(attribute.columnId)" v-slot="{ data: column }">
                      {{ column.name }}
                    </Loader>
                    <td>{{ attribute.predicateId }}</td>
                    <td>{{ attribute.dataTypeId }}</td>
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
  </article>
</template>

<style scoped>
.card-content {
  padding: 0;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Project, ResourceId, Table, Source, RemoteData, Attribute, Column, AttributeFormData } from '@/types'
import Remote from '@/remote'
import Loader from '@/components/Loader.vue'
import AttributeForm from './AttributeForm.vue'
import TableMapping from './TableMapping.vue'
import TablePreview from './TablePreview.vue'

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
        save: (attribute: AttributeFormData) => {
          this.$store.dispatch('attributes/create', { table: this.table, attribute })
          modal.close()
        }
      },
      hasModalCard: true
    })
  }

  showMapping (table: Table) {
    this.$buefy.modal.open({
      parent: this,
      component: TableMapping,
      props: { table },
      hasModalCard: true
    })
  }

  showPreview (table: Table) {
    this.$buefy.modal.open({
      parent: this,
      component: TablePreview,
      props: { table },
      hasModalCard: true
    })
  }
}
</script>

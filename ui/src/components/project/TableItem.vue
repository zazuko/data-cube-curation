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
            <td>{{ source.name }}</td>
          </tr>
          <tr v-if="!table.isFact">
            <th>Identifier template</th>
            <td><code><PrefixedURI :uri="table.identifierTemplate" :project="project" /></code></td>
          </tr>
          <tr v-if="table.attributesCollection">
            <th>Properties</th>
            <Loader tag="td" :data="valueAttributes" v-slot="{ data: attributes }">

              <table class="table is-fullwidth" v-if="attributes.length > 0">
                <thead>
                  <tr>
                    <th>Source column</th>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Language</th>
                    <th></th>
                  </tr>
                </thead>
                <Loader tag="tbody" :data="valueAttributes" v-slot="{ data: attributes }">
                  <tr v-for="attribute in attributes" :key="attribute.id">
                    <td>{{ getColumn(attribute.columnId).name }}</td>
                    <td><PrefixedURI :uri="attribute.property" :project="project" /></td>
                    <td><PrefixedURI :uri="attribute.dataTypeId" :project="project" /></td>
                    <td>{{ attribute.language }}</td>
                    <td>
                      <b-button v-if="attribute.actions.delete" icon-left="trash-can-outline" @click="deleteAttribute(attribute)" />
                      <b-button v-if="attribute.actions.edit" icon-left="pencil" />
                    </td>
                  </tr>
                </Loader>
              </table>
              <p v-else class="has-text-grey">No properties yet</p>

              <p v-if="table.actions.createValueAttribute" class="has-text-right">
                <b-button icon-left="plus" @click="createValueAttribute">
                  {{ table.actions.createValueAttribute.title }}
                </b-button>
              </p>

            </Loader>
          </tr>
          <tr v-if="table.attributesCollection">
            <th>References to other tables</th>
            <Loader tag="td" :data="referenceAttributes" v-slot="{ data: attributes }">
              <table class="table is-fullwidth" v-if="attributes.length > 0">
                <thead>
                  <tr>
                    <th>Table</th>
                    <th>Property</th>
                    <th>Column mapping</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="attribute in attributes" :key="attribute.id">
                    <td><TableTag :table="getTable(attribute.referencedTableId)" /></td>
                    <td><PrefixedURI :uri="attribute.property" :project="project" /></td>
                    <td>
                       <ul v-if="attribute.columnMapping.length > 0">
                        <li v-for="(mapping, index) in attribute.columnMapping" :key="index">
                          {{ displayColumnMapping(mapping) }}
                        </li>
                      </ul>
                      <span v-else>N/A</span>
                    </td>
                    <td>
                      <b-button v-if="attribute.actions.delete" icon-left="trash-can-outline" @click="deleteAttribute(attribute)" />
                      <b-button v-if="attribute.actions.edit" icon-left="pencil" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-else class="has-text-grey">
                No reference yet
              </p>

              <p v-if="table.actions.createReferenceAttribute" class="has-text-right">
                <b-button icon-left="plus" @click="createReferenceAttribute">
                  {{ table.actions.createReferenceAttribute.title }}
                </b-button>
              </p>

            </Loader>
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
import { IOperation, HydraResource } from 'alcaeus/types/Resources'
import { Project, ResourceId, Table, Source, RemoteData, Attribute, Column, ValueAttributeFormData, ReferenceAttributeFormData } from '@/types'
import Remote from '@/remote'
import Loader from '@/components/Loader.vue'
import ValueAttributeForm from './ValueAttributeForm.vue'
import ReferenceAttributeForm from './ReferenceAttributeForm.vue'
import TableMapping from './TableMapping.vue'
import TablePreview from './TablePreview.vue'
import TableTag from '../TableTag.vue'
import PrefixedURI from '../PrefixedURI.vue'
import * as URI from '@/api/uris'
import { getOrThrow } from '@/api/common'

@Component({
  components: {
    Loader,
    PrefixedURI,
    TableTag
  }
})
export default class extends Vue {
  @Prop() readonly project: Project
  @Prop() readonly table: Table
  @Prop() readonly tables: Table[]
  @Prop() readonly sources: Source[]

  get attributes (): RemoteData<Attribute[]> {
    return this.$store.getters['attributes/forTable'](this.table.id)
  }

  get valueAttributes () {
    if (!this.attributes.data) return Remote.loading()

    return Remote.loaded(this.attributes.data.filter((attribute) => attribute.isValue))
  }

  get referenceAttributes () {
    if (!this.attributes.data) return Remote.loading()

    return Remote.loaded(this.attributes.data.filter((attribute) => attribute.isReference))
  }

  get source (): Source {
    const source = this.sources.find((s) => s.id === this.table.sourceId)

    if (!source) throw new Error('Source not found')

    return source
  }

  getTable (id: ResourceId): Table {
    const table = this.tables.find((table) => table.id === id)

    if (!table) throw new Error(`Table not found ${id}`)

    return table
  }

  get allColumns (): Column[] {
    return this.sources.flatMap((s) => s.columns)
  }

  getColumn (id: ResourceId): Column {
    const column = this.allColumns.find((column: Column) => column.id === id)

    if (!column) throw new Error(`Column not found: ${id}`)

    return column
  }

  displayColumnMapping (mapping: HydraResource): string {
    // TODO: Cleanup once mappings have a type
    const sourceColumnName = this.getColumn(getOrThrow<Column>(mapping, URI.PROP_SOURCE_COLUMN).id).name
    const referencedColumnName = this.getColumn(getOrThrow<Column>(mapping, URI.PROP_REFERENCED_COLUMN).id).name

    return `${sourceColumnName} -> ${referencedColumnName}`
  }

  deleteTable (table: Table) {
    this.$buefy.dialog.confirm({
      title: (this.table.actions.delete as IOperation).title,
      message: 'Are you sure you want to delete this table?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        const loading = this.$buefy.loading.open({})
        await this.$store.dispatch('tables/delete', { project: this.project, table: this.table })
        loading.close()
      }
    })
  }

  createValueAttribute () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: ValueAttributeForm,
      props: {
        project: this.project,
        table: this.table,
        source: this.source,
        save: async (attribute: ValueAttributeFormData) => {
          const loading = this.$buefy.loading.open({})
          await this.$store.dispatch('attributes/createValue', { table: this.table, attribute })
          loading.close()
          modal.close()
        }
      },
      hasModalCard: true
    })
  }

  createReferenceAttribute () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: ReferenceAttributeForm,
      props: {
        operation: this.table.actions.createReferenceAttribute,
        project: this.project,
        table: this.table,
        source: this.source,
        tables: this.tables,
        sources: this.sources,
        save: async (attribute: ReferenceAttributeFormData) => {
          const loading = this.$buefy.loading.open({})
          await this.$store.dispatch('attributes/createReference', { table: this.table, attribute })
          loading.close()
          modal.close()
        }
      },
      hasModalCard: true
    })
  }

  deleteAttribute (attribute: Attribute) {
    this.$buefy.dialog.confirm({
      title: (attribute.actions.delete as IOperation).title,
      message: 'Are you sure you want to delete this attribute?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        const loading = this.$buefy.loading.open({})
        await this.$store.dispatch('attributes/delete', attribute)
        loading.close()
      }
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

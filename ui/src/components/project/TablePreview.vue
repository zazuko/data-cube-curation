<template>
  <div class="modal-card">
    <header class="modal-card-head" :style="{'background-color': table.color}">
      <h3 class="modal-card-title">{{ table.name }} mapped data preview</h3>
      <span class="modal-header-icon" v-if="table.isFact"><b-tag>Fact table</b-tag></span>
    </header>
    <section class="modal-card-body">
      <Loader :data="preview" v-slot="{ data: preview }">
        <b-tabs v-model="activeTab" :animated="false">
          <b-tab-item label="Table">
            <table class="table is-narrow">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Predicate</th>
                  <th>Object</th>
                </tr>
              </thead>
              <tbody class="is-size-7 is-family-monospace">
                <tr v-for="quad in preview.dataset" :key="quad.id">
                  <td>{{ quad.subject }}</td>
                  <td>{{ quad.predicate }}</td>
                  <td>{{ quad.object }}</td>
                </tr>
              </tbody>
            </table>
          </b-tab-item>
          <b-tab-item label="RDF (turtle)">
            <pre v-highlightjs="preview"><code class="turtle">{{ preview.n3 }}</code></pre>
          </b-tab-item>
        </b-tabs>
      </Loader>
    </section>
  </div>
</template>

<style scoped>
.modal-card {
  width: 100%;
  min-width: 640px;
  max-width: 100%;
}

.modal-card-body, pre {
  padding: 0;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Table, RemoteData } from '@/types'
import Remote from '@/remote'
import Loader from '@/components/Loader.vue'
import rdfFetch from 'rdf-fetch'
import * as N3 from 'n3'
import * as DatasetExt from 'rdf-dataset-ext'
import getStream from 'get-stream'

@Component({
  components: {
    Loader
  }
})
export default class extends Vue {
  @Prop() readonly table: Table
  preview: RemoteData<any> = Remote.loading()
  activeTab: number = 0

  async mounted () {
    this.preview = await this.loadPreview()
  }

  async loadPreview () {
    try {
      const response = await rdfFetch(this.table.preview.id, {
        headers: { 'accept': 'application/n-triples' }
      })
      const dataset = await response.dataset()
      const n3 = await serializeN3(dataset)

      return Remote.loaded({ dataset, n3 })
    } catch (e) {
      return Remote.error(e)
    }
  }
}

async function serializeN3 (dataset: any): Promise<string> {
  const serializer = new N3.StreamWriter()
  return getStream(serializer.import(DatasetExt.toStream(dataset)) as any)
}
</script>

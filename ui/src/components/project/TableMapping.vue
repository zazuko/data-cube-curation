<template>
  <div class="modal-card">
    <header class="modal-card-head" :style="{'background-color': table.color}">
      <h3 class="modal-card-title">{{ table.name }} mapping</h3>
      <span class="modal-header-icon" v-if="table.isFact"><b-tag>Fact table</b-tag></span>
    </header>
    <section class="modal-card-body">
      <Loader :data="mapping" v-slot="{ data: mapping }">
        <pre v-highlightjs="mapping"><code class="json"></code></pre>
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
import { prefixes } from '@zazuko/rdf-vocabularies'
import { Table, RemoteData } from '@/types'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import Remote from '@/remote'
import Loader from '@/components/Loader.vue'

@Component({
  components: {
    Loader
  }
})
export default class extends Vue {
  @Prop() readonly table: Table;
  mapping: RemoteData<any> = Remote.loading()

  async mounted () {
    this.mapping = await this.loadMapping()
  }

  async loadMapping () {
    return this.table.mapping.load().then(async (response: IHydraResponse) => {
      const resource = response.root as any // `any` because `HydraResource.compact`'s type is not callable
      if (resource) {
        const mapping = await resource.compact({ csvw: prefixes.csvw })
        const formattedMapping = JSON.stringify(mapping, null, 2)
        return Remote.loaded(formattedMapping)
      } else {
        return Remote.error('Could not load mapping')
      }
    }).catch((e: any) => Remote.error(e))
  }
}
</script>

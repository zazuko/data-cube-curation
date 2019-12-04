<template>
  <div class="modal-card">
    <header class="modal-card-head" :style="{'background-color': table.color}">
      <h3 class="modal-card-title">{{ table.name }} mapped data preview</h3>
      <span class="modal-header-icon" v-if="table.isFact"><b-tag>Fact table</b-tag></span>
    </header>
    <section class="modal-card-body">
      <Loader :data="preview" v-slot="{ data: preview }">
        <pre v-highlightjs="preview"><code class="json"></code></pre>
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

@Component({
  components: {
    Loader
  }
})
export default class extends Vue {
  @Prop() readonly table: Table
  preview: RemoteData<any> = Remote.loading()

  async mounted () {
    this.preview = await this.loadPreview()
  }

  async loadPreview () {
    try {
      const response = await fetch(this.table.preview.id)
      const preview = await response.json()
      const formattedPreview = JSON.stringify(preview, null, 2)
      return Remote.loaded(formattedPreview)
    } catch (e) {
      return Remote.error(e)
    }
  }
}
</script>

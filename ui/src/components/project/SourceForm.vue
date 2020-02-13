<template>
  <form class="modal-card" @submit.prevent="save(data)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ operation.title }}</h3>
    </header>
    <section class="modal-card-body">
      <b-field label="File name">
        <b-input v-model="data.name" required />
      </b-field>
      <div class="columns">
        <b-field label="CSV delimiter character" class="column">
          <b-input v-model="data.csvDelimiter" class="char-input" required />
        </b-field>
        <b-field label="CSV quote character" class="column">
          <b-input v-model="data.csvQuote" class="char-input" required />
        </b-field>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<style soped>
.char-input {
  width: 4em;
}
</style>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { IOperation } from 'alcaeus/types/Resources'
import { Source, SourceFormData } from '@/types'

@Component
export default class extends Vue {
  @Prop() operation: IOperation;
  @Prop() source: Source;
  @Prop() save: (source: SourceFormData) => void;
  data: SourceFormData;

  created () {
    this.data = {
      id: this.source.id,
      name: this.source.name,
      csvDelimiter: this.source.csvDelimiter,
      csvQuote: this.source.csvQuote,
    }
  }
}
</script>

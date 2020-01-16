<template>
  <b-tooltip :label="fullURI" v-if="uri" type="is-light" size="is-small" :delay="100" animated>
    {{ shrinkedURI }}
  </b-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Project } from '@/types'
import { expandWithBase, shrink } from '@/rdf-vocabularies'

@Component
export default class extends Vue {
  @Prop() readonly uri: string
  @Prop() readonly project: Project

  get shrinkedURI () {
    return shrink(this.uri)
  }

  get fullURI () {
    return expandWithBase(this.uri, this.project.baseUri)
  }
}
</script>

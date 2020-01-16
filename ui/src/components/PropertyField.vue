<template>
  <b-field :label="label" :message="expandedValue">
    <b-autocomplete
      :data="matchingRDFProperties"
      placeholder="e.g. rdfs:label"
      keep-first
      v-bind="$attrs"
      v-model="shortProperty"
      @input="update"
    />
  </b-field>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Project } from '@/types'
import { expand, expandWithBase, shrink } from '@/rdf-vocabularies'

@Component
export default class extends Vue {
  @Prop() project: Project
  @Prop() label: string
  @Prop() value: string
  shortProperty: string = shrink(this.value)

  update (newValue: string) {
    this.$emit('input', expand(newValue))
  }

  get rdfProperties () {
    return this.$store.state.rdfProperties
  }

  get matchingRDFProperties () {
    return this.rdfProperties.filter((term: string) => term.startsWith(this.shortProperty))
  }

  get expandedValue () {
    return expandWithBase(this.value, this.project.baseUri)
  }
}
</script>

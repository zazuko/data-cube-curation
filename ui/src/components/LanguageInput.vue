<template>
  <b-autocomplete
    :data="matchingLanguages"
    placeholder="e.g. fr"
    open-on-focus
    keep-first
    v-bind="$attrs"
    :value="value"
    @input="update"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop() value: string

  update (newValue: string) {
    this.$emit('input', newValue)
  }

  languages = ['de', 'en', 'fr', 'it']

  get matchingLanguages () {
    return this.languages.filter((language) => language.indexOf(this.value) >= 0)
  }
}
</script>

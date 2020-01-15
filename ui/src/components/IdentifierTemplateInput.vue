<template>
  <b-autocomplete
      ref="autocomplete"
      :value="value"
      @input="onUpdate"
      @typing="onTyping"
      @select="onSelect"
      :data="propositions"
      :custom-formatter="formatProposition"
      placeholder="e.g. my-table/{column_id}"
      :disabled="!source"
      keep-first
      required>
  </b-autocomplete>
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator'
import { Source } from '@/types'

@Component
export default class extends Vue {
  @Prop() value: string
  @Prop() tableName: string
  @Prop() source: Source
  wasModified = false;

  onUpdate (newValue: string) {
    this.$emit('input', newValue)
  }

  onTyping () {
    this.wasModified = true
  }

  @Watch('tableName')
  prefill () {
    if (this.wasModified) return

    if (!this.tableName) return

    const prefillValue = `${this.tableName.toLowerCase()}/{_}`
    this.$emit('input', prefillValue)
  }

  getInputElement () {
    const autocomplete = this.$refs.autocomplete as Vue
    return autocomplete ? autocomplete.$el.querySelector('input') : null
  }

  getPosition (): number {
    const inputElement = this.getInputElement()

    return inputElement ? (inputElement.selectionStart || 0) : 0
  }

  get propositions () {
    const value = this.value
    const position = this.getPosition()
    const beforeCursor = this.value.slice(0, position)
    const insideBracesMatch = beforeCursor.match(/^.*\{([^}]*)$/)
    const insideBraces = insideBracesMatch ? insideBracesMatch[1] : ''

    if (insideBracesMatch) {
      return this.source.columns
        .filter((column) => column.name.startsWith(insideBraces))
        .map((column) => column.name.substring(insideBraces.length))
    } else {
      return []
    }
  }

  formatProposition (proposition: string) {
    const position = this.getPosition()
    const nextChar = this.value[position]
    const insert = nextChar === '}' ? proposition : proposition + '}'
    const newValue = this.value.substring(0, position) + insert + this.value.substring(position)

    return newValue
  }

  onSelect () {
    const inputElement = this.getInputElement()
    inputElement && inputElement.focus()
  }
}
</script>

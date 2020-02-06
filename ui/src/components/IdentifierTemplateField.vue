<template>
  <b-field label="Identifier attribute template" :message="message">
    <b-autocomplete
        ref="autocomplete"
        :value="value"
        @input="onUpdate"
        @typing="onTyping"
        @select="onSelect"
        :data="propositions"
        :pattern="validationPattern"
        :custom-formatter="formatProposition"
        placeholder="e.g. my-table/{column_id}"
        :disabled="!source"
        keep-first
        required>
    </b-autocomplete>
  </b-field>
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator'
import { Project, Source } from '@/types'
import { expandWithBase } from '@/rdf-vocabularies'

@Component
export default class extends Vue {
  @Prop() value: string
  @Prop() project: Project
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

    const prefillValue = `${this.tableName.toLowerCase()}/{REPLACE}`
    this.$emit('input', prefillValue)
  }

  getAutocompleteComponent (): Vue | null {
    return this.$refs.autocomplete as Vue
  }

  getInputElement () {
    return this.getAutocompleteComponent()?.$el.querySelector('input') ?? null
  }

  getPosition (): number {
    const inputElement = this.getInputElement()
    return inputElement ? (inputElement.selectionStart || 0) : 0
  }

  get propositions () {
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

  get columnNames () {
    const columns = this.source?.columns ?? []
    return columns.map(({ name }) => name)
  }

  get validationPattern () {
    const columnNamesPattern = this.columnNames.join('|')
    return `([^{}]*(\\{(${columnNamesPattern})\\})?[^{}]*)*`
  }

  get invalidMessage () {
    const input = this.getAutocompleteComponent()?.$refs.input as any
    if (!this.value || !input || input.isValid) {
      return null
    }

    const matches = this.value.matchAll(/\{([^{}]*)\}/g) ?? []
    const inputColumnNames = [...matches].map((match) => match[1])
    const invalidColumnNames = inputColumnNames.filter((name) => !this.columnNames.includes(name))

    if (invalidColumnNames.length > 0) {
      return `The following columns are not valid: ${invalidColumnNames.join(', ')}`
    } else {
      return 'Invalid value'
    }
  }

  get expandedValue () {
    return expandWithBase(this.value, this.project.baseUri)
  }

  get message () {
    return this.invalidMessage ?? this.expandedValue
  }
}
</script>

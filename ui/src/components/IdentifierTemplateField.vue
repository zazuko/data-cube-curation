<template>
  <b-field label="Identifier template" :message="message" :type="{ 'is-danger': !isValid }" :addons="false">
    <b-autocomplete
        ref="autocomplete"
        :value="value"
        @input="onUpdate"
        @typing="onTyping"
        @select="onSelect"
        @blur="validate"
        :data="propositions"
        :custom-formatter="formatProposition"
        placeholder="e.g. my-table/{column_id}"
        :disabled="!source"
        keep-first
        :required="isRequired">
    </b-autocomplete>
    <p class="help" v-if="!isRequired">If omitted, a generated identifier will be used.</p>
    <p class="help" v-show="expandedValue">Expanded: {{ expandedValue }}</p>
  </b-field>
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator'
import { Project, Source, TableFormData } from '@/types'
import { expandWithBase } from '@/rdf-vocabularies'

@Component
export default class extends Vue {
  @Prop() value: string
  @Prop() project: Project
  @Prop() table: TableFormData
  @Prop() source: Source
  @Prop({ default: true }) autopopulate: boolean
  wasModified = !this.autopopulate;
  isValid = true;

  onUpdate (newValue: string) {
    this.$emit('input', newValue)
  }

  onTyping () {
    this.wasModified = true
  }

  @Watch('table.name')
  prefill () {
    if (this.wasModified) return

    if (!this.table.name) return

    const prefillValue = `${this.table.name}/{REPLACE}`
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

  get invalidMessage () {
    if (!this.value) {
      if (!this.isRequired) {
        return null
      } else {
        return 'Please fill in this field'
      }
    }

    const matches = this.value.matchAll(/\{([^{}]*)\}/g) ?? []
    const inputColumnNames = [...matches].map((match) => match[1])
    const invalidColumnNames = inputColumnNames.filter((name) => !this.columnNames.includes(name))

    if (invalidColumnNames.length > 0) {
      return `The following columns are not valid: ${invalidColumnNames.join(', ')}`
    } else {
      return null
    }
  }

  validate () {
    this.isValid = !this.invalidMessage
  }

  get message () {
    return this.isValid ? '' : this.invalidMessage
  }

  get expandedValue () {
    return expandWithBase(this.value, this.project.baseUri)
  }

  get isRequired () {
    return this.table.type === 'dimension'
  }
}
</script>

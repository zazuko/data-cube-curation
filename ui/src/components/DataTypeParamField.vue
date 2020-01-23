<template>
  <b-field :label="param | capitalize" :message="helpMessage">
    <LanguageInput v-if="param === 'language'" :value="value" @input="onInput" />
    <b-input v-else :placeholder="placeholder" :value="value" @input="onInput" />
  </b-field>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataType } from '@/types'
import * as datatypes from '@/datatypes'
import LanguageInput from './LanguageInput.vue'

@Component({
  components: {
    LanguageInput
  }
})
export default class extends Vue {
  @Prop() param: string
  @Prop() value: string
  @Prop() dataType: DataType

  onInput (newValue: string) {
    this.$emit('input', newValue)
  }

  get help () {
    const dataTypeName = datatypes.byURI(this.dataType.id)?.name ?? ''
    return helpFor(this.param, dataTypeName)
  }

  get placeholder () {
    return this.help.placeholder
  }

  get helpMessage () {
    return this.help.message
  }
}

function helpFor (param: string, dataTypeName: string): { placeholder: string, message: string } {
  const help = { placeholder: '', message: '' }

  if (param === 'default') {
    help.message = 'Default value for empty cells.'
  } else if (param === 'format') {
    if (dataTypeName === 'boolean') {
      help.placeholder = 'e.g. 0|1'
      help.message = 'The "true" value followed by the "false" value, separated by "|". Example: Y|N'
    } else if (datatypes.isDateType(dataTypeName)) {
      help.placeholder = 'e.g. YYYY'
      help.message = 'Symbols defined in https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table'
    } else if (datatypes.isDurationType(dataTypeName)) {
      help.message = 'Regular expression to transform value into a valid ISO8601 duration.'
    } else if (datatypes.isNumericType(dataTypeName)) {
      help.placeholder = 'e.g. ###.##'
      help.message = 'Number format pattern, as defined in https://www.unicode.org/reports/tr35/tr35-numbers.html#Number_Format_Patterns'
    } else {
      help.message = 'Valid regular expression'
    }
  }

  return help
}
</script>

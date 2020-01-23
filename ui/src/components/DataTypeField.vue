<template>
    <b-field :label="label" class="data-type-input">
      <b-field>
        <b-autocomplete
          v-model="typeName"
          @select="onSelect"
          @blur="onBlur"
          @typing="filterDatatypes"
          :data="matchingDatatypes"
          field="name"
          placeholder="e.g. string"
          open-on-focus
          keep-first
          class="select"
          expanded
        >
          <template slot="empty">"{{ type }}" is not a valid data type</template>
        </b-autocomplete>

        <b-tooltip label="Data type options" type="is-dark" :delay="100">
          <b-button :icon-left="showParams ? 'times' : 'cog'" @click="showParams = !showParams" :disabled="!hasTypeParams" />
        </b-tooltip>
      </b-field>

      <b-collapse :open.sync="showParams" animation="fade" v-if="hasTypeParams">
        <div class="box">
          <b-field v-for="param in typeParams" :key="param" custom>
            <DataTypeParamField :param="param" v-model="value.params[param]" :dataType="value" />
          </b-field>
        </div>
      </b-collapse>
    </b-field>
</template>

<style scoped>
.data-type-input {
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DataTypeOption, DataType } from '@/types'
import { expand } from '@/rdf-vocabularies'
import * as datatypes from '@/datatypes'
import DataTypeParamField from './DataTypeParamField.vue'

@Component({
  components: {
    DataTypeParamField
  }
})
export default class extends Vue {
  @Prop() value: DataType | null
  @Prop() label: string
  matchingDatatypes = datatypes.all
  showParams = false

  typeName: string = datatypes.byURI(this.value?.id ?? '')?.name ?? ''

  get type (): DataTypeOption | null {
    return datatypes.byName(this.typeName)
  }

  get typeParams (): string[] {
    return this.type?.params ?? []
  }

  get hasTypeParams (): boolean {
    return !!this.value && this.typeParams.length > 0
  }

  onSelect (newValue: DataTypeOption) {
    const newValueURI = newValue ? expand(newValue.uri) : null

    if (newValueURI !== this.value?.id) {
      const datatype = newValueURI ? { id: newValueURI, params: {} } : null
      this.$emit('input', datatype)
    }
  }

  onBlur () {
    // Empty input if no valid type was selected
    if (!this.value) {
      this.typeName = ''
    }

    this.matchingDatatypes = datatypes.all
  }

  filterDatatypes (value: string) {
    this.matchingDatatypes = datatypes.all.filter((datatype) => datatype.name.indexOf(value) >= 0)
  }

  capitalize ([firstLetter, ...rest]: string): string {
    return [firstLetter.toLocaleUpperCase(), ...rest].join('')
  }
}
</script>

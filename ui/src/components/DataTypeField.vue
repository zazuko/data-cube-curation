<template>
    <b-field :label="label" class="data-type-input">
      <b-field>
        <MultiSelect
          :value="type"
          @input="onInput"
          :options="datatypes"
          label="name"
          track-by="uri"
          placeholder="e.g. string"
        />

        <b-tooltip label="Data type options" type="is-dark" :delay="100">
          <b-button
            :icon-left="showParams ? 'times' : 'sliders-h'"
            @click="showParams = !showParams"
            :disabled="!hasTypeParams"
            :type="hasTypeParamValues ? 'has-text-info' : ''"
          />
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
  showParams = false

  get datatypes () {
    return datatypes.all.concat().sort((dt1, dt2) => {
      const name1 = dt1.name.toUpperCase()
      const name2 = dt2.name.toUpperCase()

      if (name1 < name2) {
        return -1
      } else if (name1 > name2) {
        return 1
      } else {
        return 0
      }
    })
  }

  get type (): DataTypeOption | null {
    return this.value ? datatypes.byURI(this.value.id) : null
  }

  get typeParams (): string[] {
    return this.type?.params ?? []
  }

  get hasTypeParams (): boolean {
    return !!this.value && this.typeParams.length > 0
  }

  get hasTypeParamValues (): boolean {
    const paramValues = this.value?.params ?? {}
    return Object.values(paramValues).some((v) => !!v)
  }

  onInput (newValue: DataTypeOption): void {
    const newValueURI = newValue?.uri ?? null

    if (newValueURI !== this.value?.id) {
      const datatype = newValueURI ? { id: newValueURI, params: {} } : null
      this.$emit('input', datatype)
    }
  }

  capitalize ([firstLetter, ...rest]: string): string {
    return [firstLetter.toLocaleUpperCase(), ...rest].join('')
  }
}
</script>

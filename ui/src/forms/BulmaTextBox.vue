<template>
  <b-field :label="label">
    <b-input ref="input" @input="emit" :value="value"></b-input>
  </b-field>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop() value: String;
  @Prop() label: String;

  emit (value: string) {
    this.$emit('change', value)
  }
}
</script>

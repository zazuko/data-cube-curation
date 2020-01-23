<template>
  <component :is="tag">
    <div class="loading-container content has-text-grey has-text-centered" v-if="data.isLoading">
      <b-icon icon="spinner" size="is-large" class="loading-icon" />
    </div>

    <div class="content has-text-danger has-text-centered" v-if="data.error">
      <p>Error: {{ data.error }}</p>
    </div>

    <slot v-if="isReady" v-bind:data="data.data"></slot>
  </component>
</template>

<style scoped>
.loading-container {
  padding: 2em;
}

.loading-icon {
  animation: rotation 1s infinite linear;
}

@keyframes rotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { RemoteData } from '../types'

@Component
export default class Loader extends Vue {
  @Prop() data: RemoteData<any>;
  @Prop({ default: 'div' }) readonly tag: string;

  get isReady () {
    return !this.data.isLoading && !this.data.error
  }
}
</script>

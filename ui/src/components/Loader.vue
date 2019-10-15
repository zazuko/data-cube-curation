<template>
  <div>
    <div class="content has-text-grey has-text-centered" v-if="data.isLoading">
      <p>Loading...</p>
    </div>

    <div class="content has-text-danger has-text-centered" v-if="data.error">
      <p>Error: {{ data.error }}</p>
    </div>

    <slot v-if="isReady" v-bind:data="data.data"></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RemoteData } from '../types';


@Component
export default class Loader extends Vue {
  @Prop() data: RemoteData<any>;

  get isReady() {
    return !this.data.isLoading && !this.data.error;
  }
}
</script>

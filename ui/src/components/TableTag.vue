<template>
  <b-tag :style="{'background-color': table.color}">
    {{ table.name }}
  </b-tag>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';


@Component({
  components: {
  },
})
export default class TabRules extends Vue {
  @Prop() table;
}
</script>

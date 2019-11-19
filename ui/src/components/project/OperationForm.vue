<template>
  <form class="modal-card" @submit.prevent="save(operation, $refs.form.value)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ operation.title }}</h3>
    </header>
    <section class="modal-card-body">
      <alcaeus-form ref="form" :operation.prop="operation"
                    no-legend no-labels
                    no-submit-button no-reset-button no-clear-button></alcaeus-form>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import '@hydrofoil/alcaeus-forms/alcaeus-form'
import { IOperation } from 'alcaeus/types/Resources'

@Component
export default class OperationForm<T> extends Vue {
  @Prop() save: (project: any) => any;
  @Prop() operation: IOperation
}
</script>

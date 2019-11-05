<template>
  <form class="modal-card" @submit.prevent="save($refs.form.value)">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ operation.title }}</h3>
    </header>
    <section class="modal-card-body">
      <alcaeus-form ref="form" :operation.prop="operation"
                    no-legend no-submit-button no-reset-button no-clear-button no-labels></alcaeus-form>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Project, Table, Rule, Source } from '../../types'
import '@hydrofoil/alcaeus-forms/alcaeus-form'
import { IOperation } from 'alcaeus/types/Resources'

@Component
export default class extends Vue {
  @Prop() project: Project;
  @Prop() save: (project: Project) => any;
  @Prop() operation: IOperation
}
</script>

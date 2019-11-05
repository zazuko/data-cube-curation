import { html } from 'lit-html'
import textboxFactory from '@lit-any/forms/lib/components/textbox'
import Vue from 'vue'
import vueCustomElement from 'vue-custom-element'
import Input from './BulmaTextBox.vue'

Vue.use(vueCustomElement)

Vue.customElement('b-textbox', (new Input().$options))

function vueSetter (set: (value: unknown) => void) {
  return (e: CustomEvent) => {
    if (e.detail) { set(e.detail[0]) }
  }
}

export const textbox = textboxFactory(() => (f, id, v, set) => html`
  <b-textbox .label="${f.title}" .value="${v || ''}" @change="${vueSetter(set)}"></b-textbox>
`)

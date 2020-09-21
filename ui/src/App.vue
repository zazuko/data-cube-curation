<template>
  <div id="app" class="container is-fluid">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Data-cube-curation
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ name: 'projects' }">
          Projects
        </b-navbar-item>
      </template>
    </b-navbar>

    <main class="main section">
      <router-view/>

      <div class="errors">
        <b-message v-for="(error, index) in errors" :key="index" :title="error.title" type="is-danger" has-icon aria-close-label="Dismiss" @close="dismissError(error)">
          {{ error.detail }}
          <a target="_blank" v-if="error.link" :href="error.link.href" >{{ error.link.title }}</a>
        </b-message>
      </div>
    </main>
  </div>
</template>

<style>
  .card-header-icon {
    cursor: inherit;
  }

  .card-footer .card-actions {
    flex-grow: 1;
    text-align: right;
  }

  .card-footer .card-actions .button {
    margin-left: -1px;
  }
</style>

<style scoped>
  .errors {
    position: fixed;
    bottom: 1em;
    right: 1em;
    z-index: 50;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ErrorMessage } from './types'

@Component
export default class AppView extends Vue {
  mounted () {
    this.$store.dispatch('loadRDFProperties')
  }

  get errors () {
    return this.$store.state.errors
  }

  dismissError (error: ErrorMessage) {
    this.$store.dispatch('dismissError', error)
  }
}
</script>

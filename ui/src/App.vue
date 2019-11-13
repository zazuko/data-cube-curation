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
        </b-message>
      </div>
    </main>
  </div>
</template>

<style>
  .card-header-icon {
    cursor: inherit;
  }
</style>

<style scoped>
  .errors {
    position: fixed;
    bottom: 1em;
    right: 1em;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ErrorMessage } from './types'

@Component
export default class AppView extends Vue {
  get errors () {
    return this.$store.state.errors
  }

  dismissError (error: ErrorMessage) {
    this.$store.dispatch('dismissError', error)
  }
}
</script>

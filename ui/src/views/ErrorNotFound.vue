<template>
  <div>
    <h2 class="title is-3">
      Page not found
      <b-icon icon="sad-tear" />
    </h2>

    <section class="content">
      <p>The page you're looking for does not exist.</p>
      <p>
        <router-link :to="{ name: 'projects' }" class="button is-primary">
          Back to the projects list
        </router-link>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {}
</script>

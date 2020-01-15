<template>
  <div>
    <form class="form" @submit.prevent="save">
      <b-field label="Name">
        <b-input v-model="data.name" required />
      </b-field>
      <b-field label="Base URI" message="Default prefix for tables and properties">
        <b-input v-model="data.baseUri" placeholder="https://my-project.example.org" />
      </b-field>

      <button class="button is-primary">Save settings</button>
    </form>

  <div class="panel">
    <b-button type="is-danger" icon-left="trash-can-outline" v-if="project.actions.delete.title" @click="doDelete">
      {{ project.actions.delete.title }}
    </b-button>
  </div>
  </div>
</template>

<style scoped>
.form {
  max-width: 800px;
  margin-bottom: 2em;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Project, ProjectFormData } from '@/types'

@Component
export default class extends Vue {
  data: ProjectFormData

  get project (): Project {
    const projectId = this.$route.params.id
    const remoteProject = this.$store.getters['projects/one'](projectId)
    // Assume project is loaded because we're in a nested view
    return remoteProject.data
  }

  created () {
    this.data = {
      name: this.project.name,
      baseUri: this.project.baseUri
    }
  }

  async save () {
    const operation = this.project.actions.edit
    const data = this.data
    const loading = this.$buefy.loading.open({})
    try {
      await this.$store.dispatch('projects/save', { operation, data })
      this.$buefy.notification.open({ message: 'Settings saved successfully', type: 'is-success' })
    } finally {
      loading.close()
    }
  }

  doDelete () {
    this.$buefy.dialog.confirm({
      title: 'Delete project',
      message: 'Are you sure you want to delete this project?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        const loading = this.$buefy.loading.open({})
        try {
          await this.$store.dispatch('projects/delete', this.project)
          this.$router.push({ name: 'projects' })
        } finally {
          loading.close()
        }
      }
    })
  }
}

</script>

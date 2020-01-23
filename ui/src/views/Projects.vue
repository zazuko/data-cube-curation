<template>
  <div id="projects-page">
    <div class="level">
      <h2 class="title is-3">My projects</h2>
      <b-button type="is-primary" icon-left="plus" @click="createProject" v-if="createProjectOperation">
        {{ createProjectOperation.title }}
      </b-button>
    </div>

    <Loader :data="projects" v-slot="{ data: projects }">
      <ul class="panel" v-if="projects.length > 0">
        <li v-for="project in projects" :key="project.id" class="panel-block">
          <router-link :to="{ name: 'project', params: { id: project.id } }">
            {{ project.name }}
          </router-link>
          <router-link :to="{ name: 'project/edit', params: { id: project.id } }" class="button is-white">
            <b-icon icon="pencil-alt" size="is-small" />
          </router-link>
        </li>
      </ul>
      <section v-else class="section">
        <div class="content has-text-grey has-text-centered">
          <p>You don't have any projects yet.</p>
        </div>
      </section>
    </Loader>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Project, RemoteData, ProjectFormData } from '@/types'
import Loader from '../components/Loader.vue'
import ProjectForm from '../components/project/ProjectForm.vue'

@Component({
  components: {
    Loader,
    ProjectForm
  }
})
export default class Projects extends Vue {
  get projects (): RemoteData<Project[]> {
    return this.$store.getters['projects/list']
  }

  created () {
    this.$store.dispatch('projects/loadAll')
  }

  get createProjectOperation () {
    return this.$store.state.projects.actions.create
  }

  createProject () {
    const operation = this.createProjectOperation
    const modal = this.$buefy.modal.open({
      parent: this,
      component: ProjectForm,
      props: {
        operation: operation,
        save: async (data: ProjectFormData) => {
          const loading = this.$buefy.loading.open({})
          try {
            const project = await this.$store.dispatch('projects/save', { operation, data })
            modal.close()
            this.$router.push({ name: 'project', params: { id: project.id } })
          } finally {
            loading.close()
          }
        }
      },
      hasModalCard: true
    })
  }
}
</script>

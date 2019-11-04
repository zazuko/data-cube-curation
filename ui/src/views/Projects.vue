<template>
  <div id="projects-page">
    <h2 class="title is-2">My projects</h2>

    <div class="actions">
      <b-button type="is-primary" icon-left="plus" @click="addProject">
        New project
      </b-button>
    </div>

    <Loader :data="projects" v-slot="{ data: projects }">
      <b-table :data="projects">
        <template slot-scope="props">
          <b-table-column field="name" label="Name">
            <router-link :to="{ name: 'project', params: { id: props.row.id } }">
              {{ props.row.name }}
            </router-link>
          </b-table-column>
          <b-table-column field label="">
            <div class="buttons">
              <b-button icon-left="pencil" v-if="props.row.actions.edit" />
              <b-button icon-left="trash-can-outline" v-if="props.row.actions.delete" @click="deleteProject(props.row)" />
            </div>
          </b-table-column>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>You don't have any projects yet.</p>
            </div>
          </section>
        </template>
      </b-table>
    </Loader>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Project, RemoteData } from '../types'
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

  addProject () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: ProjectForm,
      props: {
        save: (project: Project) => {
          this.$store.dispatch('projects/create', project.name)
          modal.close()
        }
      },
      hasModalCard: true
    })
  }

  deleteProject (project: Project) {
    this.$buefy.dialog.confirm({
      title: 'Delete project',
      message: 'Are you sure you want to delete this project?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => {
        this.$store.dispatch('projects/delete', project)
      }
    })
  }
}
</script>

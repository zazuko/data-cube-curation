<template>
  <div id="projects-page">
    <h2 class="title is-2">My projects</h2>

    <div class="buttons">
      <b-button type="is-primary" icon-left="plus" @click="addProject" v-if="createOperation">
        {{ createOperation.title }}
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
              <b-button icon-left="trash-can-outline" v-if="props.row.actions.delete" @click="deleteProject(props.row, props.row.actions.delete)" />
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
import { Project, RemoteData, ProjectFormData } from '@/types'
import Loader from '../components/Loader.vue'
import OperationForm from '../components/project/OperationForm.vue'
import { IOperation } from 'alcaeus/types/Resources'

@Component({
  components: {
    Loader,
    OperationForm
  }
})
export default class Projects extends Vue {
  get projects (): RemoteData<Project[]> {
    return this.$store.getters['projects/list']
  }

  get createOperation () {
    return this.$store.state.projects.createOperation
  }

  created () {
    this.$store.dispatch('projects/loadAll')
  }

  addProject () {
    const modal = this.$buefy.modal.open({
      parent: this,
      component: OperationForm,
      props: {
        operation: this.createOperation,
        save: async (operation: IOperation, project: any) => {
          await this.$store.dispatch('invokeOperation', { operation, body: project })
          await this.$store.dispatch('projects/loadAll')
          modal.close()
        }
      },
      hasModalCard: true
    })
  }

  deleteProject (project: Project, operation: IOperation) {
    this.$buefy.dialog.confirm({
      title: 'Delete project',
      message: 'Are you sure you want to delete this project?',
      confirmText: 'Delete',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => {
        await this.$store.dispatch('invokeOperation', { operation })
        this.$store.commit('projects/removeOne', project)
      }
    })
  }
}
</script>

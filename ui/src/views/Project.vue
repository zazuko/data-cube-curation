<template>
  <Loader id="project-page" :data="project" v-slot="{ data: project }">
    <div class="level">
      <div class="level-left">
        <h2 class="level-item title is-3">{{ project.name }}</h2>
      </div>
      <div class="level-right">
        <b-field class="level-item">
          <b-tooltip label="Project URI" type="is-light" position="is-left" :delay="100" class="control">
            <b-input ref="uriInput" size="is-small" :value="project.id" :readonly="true" />
          </b-tooltip>
          <b-button size="is-small" icon-left="clipboard" title="Copy to clipboard" @click="copyProjectURI" />
        </b-field>
      </div>
    </div>

    <div class="tabs">
      <ul>
        <router-link :to="{ name: 'project/sources' }" v-slot="{ href, route, navigate, isActive }">
          <li :class="[isActive && 'is-active']">
            <a :href="href" @click="navigate">Input data</a>
          </li>
        </router-link>
        <router-link :to="{ name: 'project/tables' }" v-slot="{ href, route, navigate, isActive }">
          <li :class="[isActive && 'is-active']">
            <a :href="href" @click="navigate">Output tables</a>
          </li>
        </router-link>
        <router-link :to="{ name: 'project/edit' }" v-slot="{ href, route, navigate, isActive }" style="margin-left: auto;">
          <li :class="[isActive && 'is-active']">
            <a :href="href" @click="navigate"><b-icon icon="cog" /> Project settings</a>
          </li>
        </router-link>
      </ul>
    </div>

    <section class="tab-content">
      <router-view />
    </section>
  </Loader>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { APIErrorNotFound } from '@/api'
import { RemoteData, ResourceId, Project } from '@/types'
import Loader from '../components/Loader.vue'

@Component({
  components: {
    Loader,
  },
})
export default class ProjectView extends Vue {
  get projectId (): ResourceId {
    return this.$route.params.id
  }

  get project (): RemoteData<Project> {
    return this.$store.getters['projects/one'](this.projectId)
  }

  async created () {
    try {
      await this.$store.dispatch('projects/loadOne', this.projectId)
    } catch (e) {
      if (e instanceof APIErrorNotFound) {
        this.$router.push({ name: 'not-found' })
      } else {
        throw e
      }
    }
  }

  copyProjectURI () {
    const inputComponent = this.$refs.uriInput as Vue
    const inputElement = inputComponent?.$el.querySelector('input')

    if (!inputElement) { return }

    const success = copyInputContentToClipboard(inputElement)

    if (success) {
      this.$buefy.toast.open({
        message: 'The project URI was copied to your clipboard',
        type: 'is-success',
      })
    } else {
      this.$buefy.toast.open({
        message: 'Sorry, your browser is not very cooperative. You\'ll have to hit CMD/CTRL+C manually.',
        type: 'is-warning',
      })
    }
  }
}

function copyInputContentToClipboard (input: HTMLInputElement): boolean {
  input.select()

  let success
  try {
    success = document.execCommand('copy')
  } catch (e) {
    success = false
  }

  return success
}
</script>

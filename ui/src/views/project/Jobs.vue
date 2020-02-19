<template>
  <div>
    <form action="" @submit.prevent="triggerJob" v-if="!job" class="job-form">
      <div class="content">
        <p>Trigger a data transform job for this project</p>
      </div>

      <b-field label="S3 bucket">
        <b-input v-model="data.s3Bucket" required />
      </b-field>

      <b-field>
        <label>
          <b-checkbox v-model="data.remember" />
          Remember settings for next job
        </label>
      </b-field>

      <b-button native-type="submit" type="is-primary">Trigger job</b-button>
    </form>
    <div v-else>
      <b-message type="is-success">
        Job triggered successfully.
        <span v-show="job.link">
          <br>
          You can see the running pipeline at
          <a :href="job.link" target="_blank">{{ job.link }}</a>
        </span>
      </b-message>
      <b-button icon-left="arrow-left" @click="reset">
        Trigger another job
      </b-button>
    </div>
  </div>
</template>

<style scoped>
.job-form {
  max-width: 40em;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Project, Job, JobFormData } from '@/types'

@Component
export default class extends Vue {
  data: JobFormData;
  job: Job | null = null;

  get project (): Project {
    const projectId = this.$route.params.id
    const remoteProject = this.$store.getters['projects/one'](projectId)
    // Assume project is loaded because we're in a nested view
    return remoteProject.data
  }

  created () {
    this.reset()
  }

  async triggerJob () {
    const loading = this.$buefy.loading.open({})
    try {
      this.job = await this.$store.dispatch('projects/triggerJob', { project: this.project, data: this.data })
    } finally {
      loading.close()
    }
  }

  reset () {
    this.data = {
      s3Bucket: this.project.s3Bucket,
      remember: false,
    }
    this.job = null
  }
}
</script>

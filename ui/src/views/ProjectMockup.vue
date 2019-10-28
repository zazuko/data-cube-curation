<template>
  <div id="project-page">
    <h2 class="title is-2">{{ project.name }}</h2>

    <b-tabs v-model="activeTab">
      <b-tab-item label="Input data">
        <TabData :sources="project.sources" :rules="project.rules" :tables="project.tables" />
      </b-tab-item>

      <b-tab-item label="Output tables">
        <TabTables :tables="project.tables" />
      </b-tab-item>

      <b-tab-item label="Mapping rules">
        <TabRules :sources="project.sources" :rules="project.rules" :tables="project.tables" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RemoteData } from '../types';
import TabData from '../components/project/TabData.vue';
import TabTables from '../components/project/TabTables.vue';
import TabRules from '../components/project/TabRules.vue';


@Component({
  components: {
    TabData,
    TabTables,
    TabRules,
  },
})
export default class ProjectView extends Vue {
  activeTab = 0;

  get projectId(): string {
    return this.$route.params.id;
  }

  get project(): any {
    return this.$store.getters['projectsFixtures/one'](this.projectId);
  }
}
</script>

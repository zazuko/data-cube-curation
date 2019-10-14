<template>
    <div id="projects-page">
        <h2 class="title">My projects</h2>

        <div class="actions">
            <button class="button">New project</button>
        </div>

        <b-table :data="projects" :columns="columns" v-if="projects.length > 0">
        </b-table>
        <p v-if="projects.length === 0">You don't have any projects yet.</p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Project } from '../types';


@Component
export default class Projects extends Vue {
    columns = [
        {label: 'Name', field: 'name'},
        {label: 'ID', field: 'id'},
        {label: 'Actions', field: ''},
    ];

    get projects(): Project[] {
        return this.$store.state.projects;
    }

    created() {
        this.$store.dispatch('getAllProjects');
    }
}
</script>

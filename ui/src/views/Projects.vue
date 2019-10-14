<template>
    <div id="projects-page">
        <h2 class="title">My projects</h2>

        <div class="actions">
            <button class="button">New project</button>
        </div>

        <b-table :data="projects.data">
            <template slot-scope="props">
                <b-table-column field="name" label="Name">
                    <router-link :to="{ name: 'project', params: { id: props.row.id } }">
                        {{ props.row.name }}
                    </router-link>
                </b-table-column>
                <b-table-column field="id" label="ID">
                    {{ props.row.id }}
                </b-table-column>
                <b-table-column field="" label="Actions">
                </b-table-column>
            </template>
            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p v-if="projects.isLoading">Loading...</p>
                        <p v-else-if="projects.error" class="has-text-danger">Error: could not load projects</p>
                        <p v-else>You don't have any projects yet.</p>
                    </div>
                </section>
            </template>
        </b-table>
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
        return this.$store.getters['projects/list'];
    }

    created() {
        this.$store.dispatch('projects/loadAll');
    }
}
</script>

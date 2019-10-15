<template>
  <div id="app" class="container is-fluid">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Data-cube-curation
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ name: 'projects' }">
          Projects
        </b-navbar-item>
      </template>
    </b-navbar>

    <router-view/>
  </div>
</template>

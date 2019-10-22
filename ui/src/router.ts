import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ProjectsMockupView from './views/ProjectsMockup.vue';
import ProjectMockupView from './views/ProjectMockup.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'projects' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsMockupView,
    },
    {
      path: '/projects/:id',
      name: 'project',
      component: ProjectMockupView,
    },
  ],
});

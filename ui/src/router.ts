import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ProjectsView from './views/Projects.vue';
import ProjectView from './views/Project.vue';
import ProjectDataView from './views/project/Data.vue';
import ProjectTablesView from './views/project/Tables.vue';
import ProjectRulesView from './views/project/Rules.vue';

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
      component: ProjectsView,
    },
    {
      path: '/projects/:id',
      name: 'project',
      redirect: { name: 'project/data' },
      component: ProjectView,
      children: [
        {
          path: 'data',
          name: 'project/data',
          component: ProjectDataView,
        },
        {
          path: 'tables',
          name: 'project/tables',
          component: ProjectTablesView,
        },
        {
          path: 'rules',
          name: 'project/rules',
          component: ProjectRulesView,
        },
      ],
    },
  ],
});

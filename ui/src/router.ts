import Vue from 'vue'
import Router from 'vue-router'
import ProjectsView from './views/Projects.vue'
import ProjectView from './views/Project.vue'
import ProjectSourcesView from './views/project/Sources.vue'
import ProjectTablesView from './views/project/Tables.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'projects' }
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/projects/:id',
      name: 'project',
      redirect: { name: 'project/sources' },
      component: ProjectView,
      children: [
        {
          path: 'sources',
          name: 'project/sources',
          component: ProjectSourcesView
        },
        {
          path: 'tables',
          name: 'project/tables',
          component: ProjectTablesView
        }
      ]
    }
  ]
})

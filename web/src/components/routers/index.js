import { createRouter, createWebHistory } from 'vue-router'
import Chat from '../Chat.vue'
import codeflow from '../codeflow.vue'
import codegpt from '../codegpt.vue'
import devops from '../devops.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/codeflow',
      name: 'codeflow',
      component: codeflow
    },
    {
      path: '/codegpt',
      name: 'codegpt',
      component: codegpt
    },
    {
      path: '/devops',
      name: 'devops',
      component: devops
    }
  ]
})

export default router
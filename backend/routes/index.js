import { createRouter, createWebHistory } from 'vue-router'
import MainContent from '@/components/maincontent.vue'
import Lesson from '@/components/lessons.vue' // ✅ note the path

const routes = [
  { path: '/', name: 'Home', component: MainContent },
  { path: '/lessons', name: 'Lessons', component: Lesson },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import MainContent from '@/components/maincontent.vue'
import Lesson from '@/components/lessons.vue'
// ✅ 1. Import your course-detail component
import CourseDetail from '@/components/course-detail.vue'
import Payment from '@/components/payment.vue'
import Auth from '@/components/Auth.vue'
import Cart from '@/components/Cart.vue'
import OrderConfirmation from '@/components/OrderConfirmation.vue'
// import { name } from 'mustache'


const routes = [
  { path: '/', name: 'Home', component: MainContent },
  { path: '/lessons', name: 'Lessons', component: Lesson },
  
  // ✅ 2. Add the new route with a dynamic :id parameter
  {
    path: '/course-detail/:id', // :id will match any lesson ID
    name: 'CourseDetail',
    component: CourseDetail
  },
  
  // {
  //   path: '/payment/:id',
  //   name: 'Payment',
  //   component: Payment
  // },

  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },

  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },

  {
    path: '/order-confirmation',
    name: 'OrderConfirmation',
    component: OrderConfirmation
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
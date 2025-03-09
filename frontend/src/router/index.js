import { createRouter, createWebHistory } from 'vue-router'; 
import Login from '@/components/login.vue';
import TodoList from '@/components/task.vue';
import SignUp from '../components/SignUp.vue';

const router = createRouter({
  history: createWebHistory(), 
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/tasks',
      name: 'TodoList',
      component: TodoList,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
    { 
      path: '/signup', 
      name: 'SignUp',
      component: SignUp 

    },
  ],
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
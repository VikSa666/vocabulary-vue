import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../clients/supabase';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import UnauthorizedView from '../views/UnauthorizedView.vue';

let localUser;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/secret',
      name: 'secret',
      component: () => import('../views/SecretView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
    {
      path: '/lists/:id',
      name: 'lists',
      component: () => import('../views/ListView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
  ],
});

async function getUser(next: any) {
  localUser = await supabase.auth.getSession();
  if (localUser.data.session == null) {
    next('/unauthorized');
  } else {
    next();
  }
}

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth) {
    getUser(next);
  } else {
    next();
  }
});

export default router;

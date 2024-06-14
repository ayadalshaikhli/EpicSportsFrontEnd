import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import CampsiteGrid from '../components/CampsiteGrid.vue';
import CampsiteDetail from '../components/CampsiteDetail.vue';
import MyAccount from '../components/MyAccount.vue';
import SearchResults from '../components/SearchResults.vue';
import OwnerDashboard from '../components/OwnerDashboard.vue';
import OwnerMain from '../components/OwnerMainPage.vue';

const routes = [
  { path: '/', name: 'main', component: MainPage },
  { path: '/campsites', name: 'campsites', component: CampsiteGrid },
  { path: '/campsite/:id', name: 'CampsiteDetail', component: CampsiteDetail },
  { path: '/my-account', name: 'my-account', component: MyAccount },
  { path: '/search-results', name: 'SearchResults', component: SearchResults },
  { path: '/owner', name: 'owner-main', component: OwnerDashboard }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userId = sessionStorage.getItem('userId');

  if (requiresAuth && !userId) {
    next('/login');
  } else {
    next();
  }
});

export default router;

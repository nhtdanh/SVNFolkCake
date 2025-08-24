import { createRouter, createWebHistory } from 'vue-router'

const KitchenLayout = () => import('@/views/KitchenView.vue')
// const DashboardLayout = () => import('@/views/DashboardView.vue') 


const HomeView = () => import('@/views/kitchen/HomeView.vue')
const CakeDetailView = () => import('@/views/kitchen/CakeDetailView.vue')
const LoginView = () => import('@/views/kitchen/LoginView.vue')
const RegisterView = () => import('@/views/kitchen/RegisterView.vue')
const FavoritesView = () => import('@/views/kitchen/FavoritesView.vue')
const DetectionView = () => import('@/views/kitchen/DetectionView.vue')
const SearchView = () => import('@/views/kitchen/SearchView.vue')
const ProfileView = () => import('@/views/kitchen/ProfileView.vue')

const routes = [
  {
    path: '/',
    component: KitchenLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'cake/:id', name: 'cake-detail', component: CakeDetailView, props: true },
      { path: 'search', name: 'search', component: SearchView },
      {
        path: 'favorites',
        name: 'favorites',
        component: FavoritesView,
        meta: { requiresAuth: true },
      },
      { path: 'detection', name: 'detection', component: DetectionView },
      { path: 'login', name: 'log-in', component: LoginView, meta: { noHeader: true } },
      { path: 'register', name: 'register', component: RegisterView, meta: { noHeader: true }   },
      { path: 'profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    ],
  },

  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: DashboardLayout,
  //   children:[
  //     //
  //   ],
  //   meta: { requiresAuth: true, requiresAdmin: true },
  // },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
import { useUserStore } from '@/stores/userStore'
import VueCookies from 'vue-cookies'
router.beforeEach(async (to, from, next) => {
  const tokenPresent = !!VueCookies.get('accessToken')

  let store = null
  try {
    store = useUserStore()
  } catch (err) {

    console.error('Error accessing user store in router guard:', err)
    if (to.meta?.requiresAuth) {
      return next({ name: 'log-in', query: { redirect: to.fullPath } })
    }
    return next()
  }

  if (tokenPresent && !store.user && typeof store.loadProfile === 'function') {
    try {

      await store.loadProfile()
    } catch (err) {
      console.warn('Failed to load user profile in guard (token may be invalid):', err)
      try {
        if (typeof store.logout === 'function') await store.logout()
      } catch (e) {
        console.log(e)
      }
      try {
        VueCookies.remove('accessToken')
      } catch (e) {console.log(e)}
      return next({ name: 'log-in', query: { redirect: to.fullPath } })
    }
  }

  const roleFromStore = store?.role
  const roleFromUser = store?.user?.role
  const roleFromCookie = VueCookies.get('role')
  const role = roleFromStore || roleFromUser || roleFromCookie || null
  const isAdmin = !!role && String(role).toLowerCase() === 'admin'


  if (to.meta?.requiresAuth && !tokenPresent) {
    return next({ name: 'log-in', query: { redirect: to.fullPath } })
  }


  if (to.meta?.requiresAdmin && !isAdmin) {
    return next({ name: 'not-found' })
  }

  return next()
})

export default router

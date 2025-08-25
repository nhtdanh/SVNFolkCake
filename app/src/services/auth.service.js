import createApiClient from '@/plugins/axios'
import VueCookies from 'vue-cookies'
import router from '@/router/index'
import { useUserStore } from '@/stores/userStore'
class AuthService {
  constructor() {
    this.api = createApiClient('/api/v1/auth')
  }

  async register(payload) {
    const res = await this.api.post('/register', payload)
    return res.data
  }

  async login(payload) {
    const res = await this.api.post('/login', payload)

    // const { token, user } = res.data
    // const userId = user._id

    // Cookies.set('accessToken', token, { secure: true, sameSite: 'Strict' })
    // Cookies.set('userId', userId, { secure: true, sameSite: 'Strict' })

    // if (user.role === 'Admin') {
    //   router.push({ name: 'dashboard' })
    // } else {
    //   router.push({ name: 'home' })
    // }
    // console.log(res.data)
    return res.data
  }
  logout() {
    try {
      VueCookies.remove('accessToken')
    } catch (e) {
      console.error('Error removing cookies during signOut', e)
    }
    try {
      const userStore = useUserStore()
      if (userStore && typeof userStore.logout === 'function') userStore.logout()
    } catch (e) {
      console.log(e)
    }
    try {
      router.push({ name: 'log-in' })
    } catch (e) {
      console.log(e)
      window.location = '/log-in'
    }
  }
}

export default new AuthService()

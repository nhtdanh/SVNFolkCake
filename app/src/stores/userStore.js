import { defineStore } from 'pinia'
import VueCookies from 'vue-cookies'
import UserService from '@/services/user.service'
import FavoriteService from '@/services/favorite.service'
import AuthService from '@/services/auth.service'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    favorites: [],
    favoriteIds: [],
  }),
  getters: {
    isLogged: (state) => !!state.user,
    avatar: (state) => state.user?.avatar || '/public/uploads/avatar/default-avatar.png',
  },
  actions: {
    async loadProfile() {
      try {
        const token = VueCookies.get('accessToken')
        if (!token) {
          this.user = null
          return null
        }
        const res = await UserService.meProfile()
        this.user = res || null
        return this.user
      } catch (err) {
        console.error('loadProfile error', err)
        this.user = null
        return null
      }
    },

    async login(credentials) {
      const res = await AuthService.login(credentials)
      console.log(res)
      // backend might return token or set cookie; support both
      if (res && res.token) VueCookies.set('accessToken', res.token, '1d')

      await this.loadProfile()
      await this.loadFavorites()
      console.log(this.user.role)
      return this.user
    },

    logout() {
      VueCookies.remove('accessToken')
      this.user = null
      this.favorites = []
      this.favoriteIds = []
    },

    async loadFavorites() {
      try {
        const token = VueCookies.get('accessToken')
        if (!token) {
          this.favorites = []
          this.favoriteIds = []
          return []
        }

        const res = await FavoriteService.list() 
        const payload = res?.data 
        let raw = payload?.items ?? payload ?? []

    
        let flat = []
        if (Array.isArray(raw)) {
          raw.forEach((item) => {
            if (Array.isArray(item.cakes)) {
              flat.push(...item.cakes)
            } else if (item.cake || item.cakeId) {
              flat.push(item)
            }
          })
        } else if (raw && Array.isArray(raw.cakes)) {
          flat = raw.cakes
        } else if (raw && (raw.cake || raw.cakeId)) {
          flat = [raw]
        }

        this.favorites = flat
        this.favoriteIds = flat.map((f) => String(f.cake?._id || f.cake || f.cakeId))

        return this.favorites
      } catch (err) {
        console.error('loadFavorites error', err)
        this.favorites = []
        this.favoriteIds = []
        return []
      }
    },

    addFavoriteLocal(cakeId, favObj = null) {
      const id = String(cakeId)
      if (!this.favoriteIds.includes(id)) {
        this.favoriteIds.push(id)
      }
      if (favObj) {

        const payload = favObj?.data ?? favObj

        if (payload.cake || payload.cakeId) this.favorites.push(payload)
        else this.favorites.push({ cake: payload }) 
      }
    },

    removeFavoriteLocal(cakeId) {
      const id = String(cakeId)
      this.favoriteIds = this.favoriteIds.filter((x) => String(x) !== id)
      this.favorites = this.favorites.filter((f) => {
        const fid = String((f.cake && (f.cake._id || f.cake)) || f.cakeId || f.cake)
        return fid !== id
      })
    },
  },
})

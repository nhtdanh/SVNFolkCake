// src/services/favorite.service.js
import createApiClient from '@/plugins/axios'

class FavoriteService {
  constructor() {
    this.api = createApiClient('/api/v1/favorite')
  }

  async list() {
    return (await this.api.get('/')).data
  }
  async add(cakeId) {
    return (await this.api.post(`/${cakeId}`)).data
  }
  async remove(cakeId) {
    return (await this.api.delete(`/${cakeId}`)).data
  }
}

export default new FavoriteService()

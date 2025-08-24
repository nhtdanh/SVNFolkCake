// src/services/category.service.js
import createApiClient from '@/plugins/axios'

class CategoryService {
  constructor() {
    this.api = createApiClient('/api/v1/category')
  }
  async list() {
    return (await this.api.get('/')).data
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data
  }
  async create(payload) {
    return (await this.api.post('/', payload)).data
  }
  async update(id, payload) {
    return (await this.api.patch(`/${id}`, payload)).data
  }
  async remove(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new CategoryService()

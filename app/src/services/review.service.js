// src/services/review.service.js
import createApiClient from '@/plugins/axios'

class ReviewService {
  constructor() {
    this.api = createApiClient('/api/v1/review')
  }

  async list(params = {}) {
    return (await this.api.get('/', { params })).data
  }
  async get(id) {
    return (await this.api.get(`/cake/${id}`)).data
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

export default new ReviewService()

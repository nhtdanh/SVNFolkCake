// src/services/cake.service.js
import createApiClient from '@/plugins/axios'

class CakeService {
  constructor() {
    this.api = createApiClient('/api/v1/cake')
  }

  async list(params = {}) {
    const res = await this.api.get('/', { params })
    console.log(res.data)
    return res.data
  }

  async get(id) {
    const res = await this.api.get(`/${id}`)
    return res.data
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

  async uploadMainImage(id, file) {
    const fd = new FormData()
    fd.append('main', file)
    const res = await this.api.post(`/${id}/upload-main`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  }
}

export default new CakeService()

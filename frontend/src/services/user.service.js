import createApiClient from '@/plugins/axios'

class UserService {
  constructor() {
    this.api = createApiClient('/api/v1/user')
  }

  async list(params = {}) {
    return (await this.api.get('/', { params })).data
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data
  }
  async meProfile() {
    return (await this.api.get('/me/profile')).data
  }
  async updateMe(payload) {
    return (await this.api.patch('/me/profile', payload)).data
  }
  async changePassword(payload) {
    return (await this.api.patch('/me/change-password', payload)).data
  }
  async uploadAvatar(file) {
    const fd = new FormData()
    fd.append('avatar', file)
    return (
      await this.api.post(`/me/avatar`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    ).data
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

export default new UserService()

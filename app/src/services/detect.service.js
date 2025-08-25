import createApiClient from '@/plugins/axios'

class DetectService {
  constructor() {
    this.api = createApiClient('') // base; we'll post to /api/v1/detect
  }

  async listModels() {
    return (await this.api.get('/api/v1/detect/models')).data
  }

  // file: File object, options: { model, confidence, nms_threshold }
  async detectFile(file, options = {}) {
    const fd = new FormData()
    // use 'image' as field name (matches backend you sent)
    fd.append('image', file)

    const params = {}
    if (options.model) params.model = options.model
    if (options.confidence !== undefined && options.confidence !== null)
      params.confidence = options.confidence
    if (options.nms_threshold !== undefined && options.nms_threshold !== null)
      params.nms_threshold = options.nms_threshold

    const query = new URLSearchParams(params).toString()
    const url = '/api/v1/detect' + (query ? '?' + query : '')

    const res = await this.api.post(url, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data 
  }
}

export default new DetectService()

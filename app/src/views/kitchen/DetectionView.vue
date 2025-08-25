<template>
  <main class="container py-4">
    <div class="upload-section mb-4" :class="{ centered: !detectStore.fileUrl }">
      <div v-if="!detectStore.fileUrl" class="upload-container">
        <div class="upload-dropzone" :class="{ 'dragover': isDragOver, 'error': uploadError }" @drop="onDrop"
          @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false" @click="triggerFileInput" role="button"
          aria-label="Kéo thả hoặc chọn file ảnh">
          <div class="upload-content">
            <div class="upload-icon mb-2" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M8 7l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                  stroke-linejoin="round" />
                <rect x="3" y="14" width="18" height="6" rx="1" stroke="currentColor" stroke-width="1.2" />
              </svg>
            </div>
            <h5 class="upload-title mb-1">Kéo thả ảnh hoặc</h5>
            <p class="upload-subtitle mb-2"><span class="text-accent fw-semibold">Nhấn để chọn file</span></p>
            <div class="upload-info">
              <small class="muted-small">Hỗ trợ: JPG, PNG. Tối đa: 5MB</small>
            </div>
            <div v-if="uploadError" class="upload-error mt-2">{{ uploadError }}</div>
          </div>
        </div>

        <input ref="fileInput" type="file" @change="onFileSelect" accept="image/*" class="d-none" />
      </div>

      <div v-else class="image-preview-section" style="width:100%">
        <div class="image-preview-container">
          <div class="position-relative">
            <canvas ref="canvas" class="preview-canvas"
              style="display:block; width:100%; max-width:800px; height:auto;"></canvas>

            <!-- <button class="btn-reset" @click="resetUpload" title="Chọn ảnh khác" aria-label="Chọn ảnh khác">
              
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button> -->
          </div>
        </div>
        <div class="advanced-options mt-3">
          <button class="btn-plain" @click="showAdvanced = !showAdvanced" :aria-expanded="showAdvanced">
            Tùy chọn nâng cao
            <svg width="10" height="10" class="ms-1 transition-transform" :class="{ 'rotate-180': showAdvanced }"
              viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4.5 6.5L8 10l3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>

          <div v-if="showAdvanced" class="advanced-controls mt-2 p-3" style="margin: auto;">
            <div class="row g-2 justify-content-center">
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Độ tin cậy (confidence)</label>
                <input type="number" v-model.number="confidence" @input="onConfidenceInput" step="0.1" min="0.1" max="1"
                  class="form-control form-control-sm"  placeholder="0.50"
                  aria-label="Độ tin cậy từ 0.1 đến 1.00" />
                <small class="muted-small">Giá trị: 0.1 → 1.00</small>
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-semibold">NMS Threshold</label>
                <input type="number" v-model.number="nms" @input="onNmsInput" step="0.1" min="0.1" max="1"
                  class="form-control form-control-sm"  placeholder="0.40"
                  aria-label="NMS threshold từ 0.1 đến 1.00" />
                <small class="muted-small">Giá trị: 0.1 → 1.00</small>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons mt-3 text-center">
          <button v-if="!hasResults" class="btn-primary btn-lg" :disabled="loading" @click="detectCakes">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ loading ? 'Đang phân tích...' : 'Nhận diện' }}
          </button>

          <div v-else class="d-flex gap-2 justify-content-center">
            <button class="btn-outline btn-lg" @click="detectCakes" :disabled="loading">
              {{ loading ? 'Đang phân tích...' : 'Phân tích lại' }}
            </button>
            <button class="btn-outline btn-lg" @click="resetUpload">Chọn ảnh khác</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger rounded-3 text-center fw-semibold">
      {{ error }}
    </div>
    <div v-if="analyzed" class="results-section">
      <div v-if="hasResults">
        <div class=" text-center mb-3">
          <div class="results-header">
            <h3 class="mb-1" style="color: white;">Phát hiện {{ detectStore.detections.length }} bánh</h3>
          </div>
        </div>

        <div class="results-list">
          <div class="row g-3">
            <div v-for="(detection, idx) in detectStore.detections" :key="idx" class="col-md-6 col-lg-4">
              <div class="result-card h-100" @click="searchLabel(detection.label)" role="button"
                :aria-label="`Tìm ${detection.label}`">
                <div class="result-card-body">
                  <div class="d-flex align-items-center mb-2">
                    <div class="result-icon me-3" aria-hidden="true">
                      <span class="dot" :style="{ backgroundColor: `hsl(${(idx * 95) % 360} 70% 45%)` }"></span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="result-title mb-1">{{ detection.label }}</h6>
                      <div class="result-confidence">
                        {{ (detection.confidence * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>

                  <div class="confidence-bar">
                    <div class="confidence-fill" :style="{ width: (detection.confidence * 100) + '%' }"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class=" text-center mb-3">
          <div class="results-header">
            <h3 class="mb-1" style="color: white"> Không phát hiện bánh nào</h3>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDetectStore } from '@/stores/detectStore'
import DetectService from '@/services/detect.service'
import { useToast } from 'primevue/usetoast'

const detectStore = useDetectStore()
const canvas = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const error = ref('')
const uploadError = ref('')
const models = ref([])
const toast = useToast()
const router = useRouter()
const isDragOver = ref(false)
const showAdvanced = ref(false)
const analyzed = ref(false)
const confidence = ref(Number(detectStore.confidence ?? 0.5))
const nms = ref(Number(detectStore.nms ?? 0.4))

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB

const hasResults = computed(() =>
  detectStore.detections && detectStore.detections.length > 0
)

onMounted(async () => {
  try {
    const res = await DetectService.listModels()
    if (Array.isArray(res)) models.value = res
    else if (res?.models) models.value = res.models
    else models.value = []
  } catch (e) {
    console.warn('Could not load detect models', e)
  }

  detectStore.confidence = clampNumber(confidence.value, 0.1, 1)
  detectStore.nms = clampNumber(nms.value, 0.1, 1)

  if (detectStore.fileUrl) {
    nextTick(() => {
      const img = new Image()
      img.onload = () => {
        if (detectStore.detections && detectStore.detections.length) {
          drawImageWithBoxes(img, detectStore.detections)
        } else {
          drawImageBlank(img)
        }
      }
      img.src = detectStore.fileUrl
    })
  }
})

watch(confidence, (val) => {
  const v = clampNumber(Number(val), 0.1, 1)
  confidence.value = v
  detectStore.confidence = v
})
watch(nms, (val) => {
  const v = clampNumber(Number(val), 0.1, 1)
  nms.value = v
  detectStore.nms = v
})

function onConfidenceInput(e) {
  const v = Number(e.target.value)
  if (Number.isFinite(v)) confidence.value = v
}
function onNmsInput(e) {
  const v = Number(e.target.value)
  if (Number.isFinite(v)) nms.value = v
}

function clampNumber(v, min, max) {
  if (!Number.isFinite(v)) return min
  if (v < min) return min
  if (v > max) return max
  return Math.round(v * 100) / 100
}

function validateFile(file) {
  if (!file) return 'Không có file được chọn'

  if (!file.type.startsWith('image/')) {
    return 'Vui lòng chọn file hình ảnh (JPG, PNG, WebP)'
  }

  if (file.size > MAX_FILE_BYTES) {
    return 'File quá lớn. Kích thước tối đa: 5MB'
  }

  return null
}

function onFileSelect(e) {
  const file = e.target.files[0]
  handleFile(file)
}

function onDrop(e) {
  e.preventDefault()
  isDragOver.value = false

  const file = e.dataTransfer.files[0]
  handleFile(file)
}

function handleFile(file) {
  const validationError = validateFile(file)
  if (validationError) {
    error.value = validationError
    uploadError.value = validationError
    toast.add({
      severity: 'error',
      summary: 'Lỗi file',
      detail: validationError,
      life: 4000
    })
    return
  }

  detectStore.setFile(file)
  detectStore.setDetections([])
  error.value = ''
  uploadError.value = ''

  nextTick(() => drawImageBlank())
}

function triggerFileInput() {
  fileInput.value?.click()
}

function resetUpload() {
  detectStore.clearData()
  error.value = ''
  uploadError.value = ''
  showAdvanced.value = false
  confidence.value = Number(detectStore.confidence ?? 0.5)
  nms.value = Number(detectStore.nms ?? 0.4)
  if (fileInput.value) fileInput.value.value = ''
}

async function detectCakes() {
  if (!detectStore.file) {
    error.value = 'Vui lòng chọn ảnh trước'
    return
  }
  detectStore.confidence = clampNumber(Number(confidence.value), 0.1, 1)
  detectStore.nms = clampNumber(Number(nms.value), 0.1, 1)

  loading.value = true
  error.value = ''

  try {
    const res = await DetectService.detectFile(detectStore.file, {
      model: detectStore.model,
      confidence: detectStore.confidence,
      nms_threshold: detectStore.nms
    })

    const dets = res?.detections || res?.data?.detections || res?.results || res?.predictions || []
    const detArray = Array.isArray(dets) ? dets : (typeof dets === 'object' ? Object.values(dets) : [])
    const img = new Image()
    img.onload = () => {
      const parsed = []
      for (const item of detArray) {
        const label = item.class_name || item.class || item.label || item.name || 'bánh'
        const conf = Number(item.confidence ?? item.score ?? 0)
        const bbox = parseBBox(item)
        if (!bbox) continue
        parsed.push({ label: String(label), confidence: conf, bbox })
      }

      detectStore.setDetections(parsed)
      drawImageWithBoxes(img, parsed)

      if (parsed.length === 0) {
        toast.add({
          severity: 'info',
          summary: 'Kết quả',
          detail: 'Không phát hiện bánh nào trong ảnh',
          life: 4000
        })
      } else {
        toast.add({
          severity: 'success',
          summary: 'Thành công',
          detail: `Phát hiện ${parsed.length} mục`,
          life: 4000
        })
      }
    }
    img.src = detectStore.fileUrl

  } catch (err) {
    console.error(err)
    error.value = err?.message || 'Có lỗi xảy ra khi nhận diện ảnh'
    toast.add({
      severity: 'error',
      summary: 'Lỗi nhận diện',
      detail: error.value,
      life: 5000
    })
  } finally {
    loading.value = false
    analyzed.value = true
  }
}


function parseBBox(item) {
  if (!item) return null
  const b = item.bbox
  if (b && typeof b === 'object') {
    if ('x1' in b && 'y1' in b && 'x2' in b && 'y2' in b) {
      return [Number(b.x1), Number(b.y1), Number(b.x2), Number(b.y2)]
    }
    if ('x' in b && 'y' in b && ('w' in b || 'width' in b)) {
      const x = Number(b.x || b.x1 || 0)
      const y = Number(b.y || b.y1 || 0)
      const w = Number(b.w ?? b.width ?? 0)
      const h = Number(b.h ?? b.height ?? 0)
      return [x, y, x + w, y + h]
    }
  }
  if (Array.isArray(item) && item.length >= 4) {
    const [a, b2, c, d] = item.slice(-4).map(Number)
    return [a, b2, c, d]
  }
  return null
}


function drawImageBlank(img = null) {
  const c = canvas.value
  if (!c) return

  if (!img) {
    if (!detectStore.fileUrl) return
    img = new Image()
    img.onload = () => drawImageBlank(img)
    img.src = detectStore.fileUrl
    return
  }

  const ctx = c.getContext('2d')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.drawImage(img, 0, 0)
}


function drawImageWithBoxes(img, boxes) {
  const c = canvas.value
  if (!c || !img) return

  const ctx = c.getContext('2d')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.drawImage(img, 0, 0)

  const lineWidth = Math.max(2, Math.round(2 * (c.width / 800)))
  ctx.lineWidth = lineWidth

  boxes.forEach((detection, idx) => {
    const [x1, y1, x2, y2] = detection.bbox.map(Number)
    const X1 = Math.max(0, Math.min(c.width, x1))
    const Y1 = Math.max(0, Math.min(c.height, y1))
    const X2 = Math.max(0, Math.min(c.width, x2))
    const Y2 = Math.max(0, Math.min(c.height, y2))
    const w = Math.max(1, X2 - X1)
    const h = Math.max(1, Y2 - Y1)

    const hue = (idx * 137.5) % 360
    const color = `hsl(${hue} 80% 45%)`


    ctx.strokeStyle = color
    ctx.globalAlpha = 1
    ctx.strokeRect(X1, Y1, w, h)


    const labelText = `${detection.label} ${(detection.confidence * 100).toFixed(0)}%`
    const fontSize = Math.max(12, Math.round(14 * (c.width / 800)))
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

    const padding = 6
    const textMetrics = ctx.measureText(labelText)
    const textW = textMetrics.width + padding * 2
    const textH = fontSize + padding


    ctx.fillStyle = color
    ctx.globalAlpha = 0.9
    ctx.fillRect(X1, Math.max(0, Y1 - textH), textW, textH)


    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = 1
    ctx.textBaseline = 'middle'
    ctx.fillText(labelText, X1 + padding, Math.max(textH / 2, Y1 - textH / 2))

    ctx.textBaseline = 'alphabetic' // reset
  })
}


function searchLabel(label) {
  router.push({ name: 'search', query: { q: label } })
}
</script>

<style scoped>
:root {
  --accent: #2563eb;
  --muted: #6b7280;
  --bg: #ffffff;
  --card-border: #e6edf3;
}


.upload-section {
  max-width: 820px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}


.upload-section.centered {
  min-height: calc(100vh - 4rem);

  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}


.upload-dropzone {
  width: 800px;
  max-width: 92%;
  height: 300px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  box-shadow: 0 6px 30px rgba(15, 23, 42, 0.03);
}

.upload-dropzone:hover {
  border-color: rgba(37, 99, 235, 0.18);
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.05);
}

.upload-dropzone.dragover {
  border-color: var(--accent);
  background: #fbfeff;
  transform: scale(1.01);
}

.upload-dropzone.error {
  border-color: #dc3545;
  background: #fff5f5;
}

.upload-icon {
  color: var(--muted);
}

.upload-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 1.05rem;
  margin: 0;
}

.upload-subtitle {
  color: var(--muted);
  font-size: 0.95rem;
  margin: 0;
}

.upload-info {
  padding-top: 0.5rem;
  margin-top: 0.6rem;
}

.muted-small {
  color: var(--muted);
  font-size: 0.82rem;
}

.upload-error {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 6px;
}


.image-preview-section {
  text-align: center;
  width: 100%;
}

.image-preview-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.preview-canvas {
  border: 1px solid var(--card-border);
  background: var(--bg);
  display: block;
  transform-origin: center;
}

.btn-reset {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 6px;
  background: rgba(37, 99, 235, 0.9);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.btn-reset:hover {
  filter: brightness(1.05);
}


.btn-plain {
  background: none;
  border: none;
  color: var(--muted);
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-plain:hover {
  color: var(--accent);
}

.btn-primary {
  background: #ff8a50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.2rem;
  font-weight: 600;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.btn-lg {
  font-size: 0.95rem;
}


.results-section {
  max-width: 1000px;
  margin: 1.8rem auto 0;
}

.results-header {
  min-width: 280px;
  font-size: large;
  padding: 1rem;
  background: #ff8a50;
  border-radius: 10px;
  border: 1px solid #ff8a50;
  display: inline-block;
}

.result-card {
  background: #fff;
  border: 1.5px solid rgb(207, 199, 199);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  overflow: hidden;
}

.result-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.06);
  border-color: rgba(37, 99, 235, 0.12);
}

.result-card-body {
  padding: 0.9rem;
}

.result-title {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.98rem;
  margin: 0;
}

.result-confidence {
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 2px;
}


.confidence-bar {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 4px;
  margin: 0.6rem 0;
}

.confidence-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 4px;
  transition: width 0.35s ease;
}

input[type=" number"]::-webkit-outer-spin-button, input[type="number" ]::-webkit-inner-spin-button { background:
              transparent; color: b; } input[type="number" ] { -moz-appearance: textfield; } @media (max-width: 768px) {
              .upload-section.centered { min-height: calc(100vh - 3.5rem); } .upload-dropzone { min-height: 160px; }
              .btn-lg { width: 100%; } } 
</style>

// src/stores/detectStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDetectStore = defineStore('detect', () => {
  const file = ref(null) 
  const fileUrl = ref('') 
  const detections = ref([]) 
  const model = ref('')
  const confidence = ref(0.5)
  const nms = ref(0.4)

  function setFile(f) {
    if (fileUrl.value) {
      try {
        URL.revokeObjectURL(fileUrl.value)
      } catch (e) {
        console.log(e)
      }
    }
    file.value = f
    fileUrl.value = f ? URL.createObjectURL(f) : ''
  }

  function setDetections(arr) {
    detections.value = arr || []
  }

  function clearData() {
    file.value = null
    try {
      if (fileUrl.value) URL.revokeObjectURL(fileUrl.value)
    } catch (e) {
      console.log(e)
    }
    fileUrl.value = ''
    detections.value = []
  }

  function clear() {
    clearData()
    model.value = ''
    confidence.value = 0.5
    nms.value = 0.4
  }

  return {
    file,
    fileUrl,
    detections,
    model,
    confidence,
    nms,
    setFile,
    setDetections,
    clearData,
    clear,
  }
})

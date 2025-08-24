<template>
  <div class="card cake-card h-100">
    <img :src="imageUrl" class="card-img-top" alt="cake" loading="lazy" @click="openDetail" />
    <div class="card-body d-flex flex-column">
      <h6 class="card-title mb-1 flex-grow-0" @click="openDetail" :title="cake.name">
        {{ cake.name || 'Tên bánh không có' }}
      </h6>
      <small class="text-muted mb-2 flex-grow-0">{{ cake.englishName || '' }}</small>

      <div class="d-flex justify-content-between align-items-center mt-auto">
        <div class="small text-muted">
          <span class="text-warning">★</span>
          {{ (cake.rating && cake.rating.average) ? Number(cake.rating.average).toFixed(1) : '0.0' }}
          ({{ cake.rating?.count || 0 }})
        </div>
        <button class="btn btn-sm icon-btn p-0" @click="toggleFavorite">
          <i :class="favClass"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import FavoriteService from '@/services/favorite.service'

const props = defineProps({ cake: { type: Object, required: true } })
const cake = props.cake

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const baseApi = import.meta.env.VITE_API_BASE_URL || ''

const imageUrl = computed(() => {
  const img = cake.image
  if (!img) return baseApi + '/public/uploads/cakes/default.jpg'
  if (typeof img === 'string') return img.startsWith('http') ? img : baseApi + img
  if (img.main) return img.main.startsWith('http') ? img.main : baseApi + img.main
  return baseApi + '/public/uploads/cakes/default.jpg'
})

const isFavorited = ref(userStore.favoriteIds.includes(String(cake._id || cake.id)))
const favClass = computed(() => (isFavorited.value ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'))

function openDetail() {
  router.push({ name: 'cake-detail', params: { id: cake._id || cake.id } })
}

async function toggleFavorite(e) {
  e?.stopPropagation?.()
  if (!userStore.isLogged) {
    router.push({ name: 'log-in', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  try {
    if (!isFavorited.value) {
      const res = await FavoriteService.add(cake._id || cake.id)
      userStore.addFavoriteLocal(cake._id || cake.id, res?.data ?? res)
      isFavorited.value = true
      toast.add({ severity: 'success', summary: 'Đã thêm', detail: 'Đã thêm vào yêu thích', life: 2000 })
    } else {
      await FavoriteService.remove(cake._id || cake.id)
      userStore.removeFavoriteLocal(cake._id || cake.id)
      isFavorited.value = false
      toast.add({ severity: 'info', summary: 'Đã xoá', detail: 'Đã xóa khỏi yêu thích', life: 2000 })
    }
  } catch (err) {
    console.error('toggleFavorite error', err)
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Thao tác thất bại', life: 3000 })
  }
}
</script>

<style scoped>
.card.h-100,
.cake-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cake-card .card-body,
.card.h-100 .card-body {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  flex: 1 1 auto;
}

.cake-card img,
.card-img-top {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background-color: #f2f4f6;
}

.row>[class*="col-"]>.card.h-100 {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cake-grid {
  align-items: start;
}

@media (max-width: 576px) {

  .cake-card img,
  .card-img-top {
    aspect-ratio: 16 / 9;
  }
}

.card {
  margin-bottom: 0;
}
</style>
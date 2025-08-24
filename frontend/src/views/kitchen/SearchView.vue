<template>
    <main class="container py-4">
        <h5 style="font-weight: bold;">Kết quả tìm kiếm cho "{{ q }}"</h5>
        <div v-if="cakes.length" class="d-flex gap-3 flex-wrap mt-3">
            <div v-for="c in cakes" :key="c._id || c.id" style="width:220px">
                <CakeCard :cake="c" :favoritedIds="favoritedIds" />
            </div>
        </div>
        <div v-else class="text-muted mt-3">Không tìm thấy kết quả</div>
    </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import CakeService from '@/services/cake.service'
import { useUserStore } from '@/stores/userStore'
import CakeCard from '@/components/cake/CakeCard.vue'

const route = useRoute()
const q = ref(route.query.q || '')
const cakes = ref([])
const userStore = useUserStore()
const favoritedIds = ref([])

async function load() {
    try {
        const res = await CakeService.list({ q: q.value, limit: 50 })
        console.log(res)
        const list = res.items;
        console.log(list)
        cakes.value = list
        if (!userStore.favoriteIds.length) {
            await userStore.loadFavorites()
        }
        favoritedIds.value = userStore.favoriteIds || []
    } catch (err) {
        console.error(err)
    }
}

onMounted(load)
watch(() => route.query.q, (v) => { q.value = v || ''; load() })
</script>

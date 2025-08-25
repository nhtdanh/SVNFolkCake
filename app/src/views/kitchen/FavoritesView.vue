<template>
    <main class="container py-4">
        <h4 style="font-weight: bold; color: #ff6b35; text-align: center; margin-bottom: 20px;">
            Các món bánh yêu thích</h4>
        <div v-if="cakes.length" class="d-flex gap-3 flex-wrap">
            <div v-for="c in cakes" :key="c._id || c.id" style="width:220px">
                <CakeCard :cake="c" />
            </div>
        </div>
        <div v-else class="text-muted" style="text-align: center;">Bạn chưa có bánh nào trong Yêu thích</div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FavoriteService from '@/services/favorite.service'
import CakeService from '@/services/cake.service'
import CakeCard from '@/components/cake/CakeCard.vue'

const cakes = ref([])

onMounted(async () => {
    try {
        const favRes = await FavoriteService.list({ limit: 1000 })

        const favs = favRes?.data?.cakes || [];
        const cakeIds = favs.map(f => f.cake?._id || f.cake || f.cakeId);
        if (cakeIds.length) {
            const all = await CakeService.list({ limit: 1000 })
            const list = Array.isArray(all) ? all : (all.items || all.cakes || [])
            cakes.value = list.filter(c => cakeIds.includes(c._id || c.id))
        } else cakes.value = []
    } catch (err) { console.error(err) }
})
</script>

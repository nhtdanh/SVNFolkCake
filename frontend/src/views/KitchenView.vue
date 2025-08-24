<template>
    <div>
        <KitchenHeader  v-if="showHeader"/>
        <router-view />
    </div>
</template>

<script setup>
import KitchenHeader from '@/components/layout/KitchenHeader.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const showHeader = computed(() => {
    return !route.matched.some(r => r.meta && r.meta.noHeader)
})
</script>

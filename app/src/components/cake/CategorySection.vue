<template>
  <section class="mb-4">
    <h6 class="mb-3">{{ title }}</h6>
    <div class="row g-3">
      <div v-for="c in displayed" :key="c._id || c.id" class="col-md-4">
        <CakeCard :cake="c" />
      </div>
    </div>

    <div v-if="!displayed.length" class="text-muted text-center py-4">
      Không có bánh nào trong danh mục này
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import CakeCard from './CakeCard.vue'
import CakeService from '@/services/cake.service'
import { useUserStore } from '@/stores/userStore'

const props = defineProps({
  category: { type: Object, required: true },
  limit: { type: Number, default: 6 },
  showAll: { type: Boolean, default: false }
})

const displayed = ref([])
const userStore = useUserStore()

async function load() {
  try {
    const { items } = await CakeService.list({ limit: 100 })

    if (props.showAll) {
      displayed.value = items.slice(0, props.limit)
    } else {
      const id = props.category._id || props.category.id
      displayed.value = items
        .filter(c => {
          const cat = c.category && (c.category._id || c.category.id || c.category)
          return String(cat) === String(id)
        })
        .slice(0, props.limit)
    }

    await userStore.loadFavorites()
  } catch (err) {
    console.error(err)
  }
}

onMounted(load)
watch(() => [props.category, props.showAll], load)
</script>

<style scoped>
.col-md-4 {
  display: flex;
}
</style>
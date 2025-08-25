<template>
    <main class="container">
        <BannerHero />
        <section class="mt-4">
            <div class="d-flex justify-content-end align-items-center mb-3">
                <div class="dropdown">
                    <button class="btn category-btn dropdown-toggle" type="button" id="categoryDropdown"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        {{ selectedCategory ? selectedCategory.name : 'Tất cả' }}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="categoryDropdown">
                        <li><a class="dropdown-item" href="#" @click.prevent="selectCategory(null)">Tất cả</a></li>
                        <li v-for="cat in categories" :key="cat._id || cat.id">
                            <a class="dropdown-item" href="#" @click.prevent="selectCategory(cat)">{{ cat.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <CategorySection :category="selectedCategory || allCategory" :limit="selectedCategory ? 50 : 50"
                    :show-all="!selectedCategory" />
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoryService from '@/services/category.service'
import BannerHero from '@/components/ui/BannerHero.vue'
import CategorySection from '@/components/cake/CategorySection.vue'



const categories = ref([])
const selectedCategory = ref(null)

const allCategory = ref({
    _id: 'all',
    id: 'all',
    name: 'Tất cả'
})

onMounted(async () => {
    try {
        const res = await CategoryService.list()
        const list = Array.isArray(res) ? res : (res.data || res.categories || [])
        categories.value = list
    } catch (err) {
        console.error(err)
    }
})

function selectCategory(cat) {
    selectedCategory.value = cat
}
</script>   
<style scoped>
#categoryDropdown.btn-outline-secondary:hover {
    background-color: var(--accent);
    color: #fff;
    border-color: var(--accent);
}
.category-btn {
    border: 1px solid #ccc;
    background-color: #fff;
    color: #333;
    transition: all .2s ease;
}

.category-btn:hover {
    background-color: var(--accent);
    color: #fff;
    border-color: var(--accent);
}
</style>

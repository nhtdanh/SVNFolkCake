<template>
    <nav class="navbar navbar-expand-lg navbar-light kitchen-header wrap__app">
        <div class="container">
            <div class="brand-search">
                <router-link to="/" class="navbar-brand nav-home">
                    <img :src="logo" alt="Home" style="height:38px;object-fit:contain" />
                </router-link>

                <div class="input-group kitchen-search">
                    <input v-model="q" @keyup.enter="onSearch" type="text" class="form-control form-control-sm"
                        placeholder="Tìm kiếm bánh" aria-label="Tìm kiếm" />
                    <button class="btn btn-sm btn-outline" @click="onSearch" aria-label="Tìm">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu"
                aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navMenu">
                <ul class="navbar-nav ms-3">
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{ 'is-active': isActive('home') }" to="/">Trang
                            chủ</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{ 'is-active': isActive('detection') }"
                            :to="{ name: 'detection' }">Nhận dạng</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{ 'is-active': isActive('favorites') }"
                            :to="{ name: 'favorites' }">Yêu thích</router-link>
                    </li>

                </ul>

                <div class="nav-right">
                    <div v-if="isLogged" class="dropdown">
                        <a class="btn btn-sm btn-outline dropdown-toggle" href="#" role="button"
                            data-bs-toggle="dropdown">
                            <!-- <img :src="userAvatar" class="rounded-circle"
                                style="width:28px;height:28px;object-fit:cover" /> -->
                            <span class="ms-1">{{ userStore.user?.name || userStore.user?.username }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <!-- <li><router-link class="dropdown-item" :to="{ name: 'profile' }">Hồ sơ</router-link></li> -->
                            <li><a class="dropdown-item" href="#" @click.prevent="logout">Đăng xuất</a></li>
                        </ul>
                    </div>

                    <router-link v-else class="btn btn-primary" :to="{ name: 'log-in' }">Đăng nhập</router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import AuthService from '@/services/auth.service'
import logo from '@/assets/logo.png'
const q = ref('')
const router = useRouter()
const userStore = useUserStore()

const isLogged = computed(() => userStore.isLogged)

function onSearch() {
    const query = (q.value || '').trim()
    if (!query) return
    router.push({ name: 'search', query: { q: query } })
}

async function logout() {
    try {
        await AuthService.logout()
    } catch (err) {
        console.warn('logout error', err)
    } finally {
        userStore.$reset()
        router.push({ name: 'home' })
    }
}

onMounted(async () => {
    if (!userStore.user) {
        try {
            await userStore.loadProfile()
            await userStore.loadFavorites()
        } catch (err) {
            console.warn('header load profile error', err)
        }
    }
})

function isActive(name) {
    return router.currentRoute.value.name === name
}
</script>

<style scoped>
.navbar-brand {
    font-size: 1.05rem;
}

.kitchen-header {
    position: sticky;
    top: 0;
    z-index: 1100;
    background: #FFFDF3;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding-top: 0.35rem;
    padding-bottom: 0.35rem;
}

</style>

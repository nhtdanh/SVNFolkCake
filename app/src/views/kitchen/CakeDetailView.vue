<template>
    <main class="container-fluid cake-detail-page">
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Đang tải thông tin bánh...</p>
        </div>

        <div v-else-if="cake" class="cake-content">
            <section class="hero-section">
                <div class="row g-4 align-items-stretch">
                    <div class="col-12 col-lg-6">
                        <div class="image-container">
                            <div class="main-image-wrapper">
                                <img :src="imageUrl" class="main-image" :alt="cake.name" />
                                <div class="image-overlay">
                                    <button class="favorite-btn" @click="toggleFavorite" :disabled="busyFavorite">
                                        <i :class="favClass"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="rating-badge">
                                <div class="rating-score">
                                    <span class="score-number">{{ formatRatingScore(cake.rating?.average) }}</span>
                                    <div class="rating-stars">
                                        <span v-for="n in 5" :key="'hero-star-' + n">
                                            <i :class="starClassForAverage(n, cake.rating?.average)"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="rating-count">{{ cake.rating?.count || 0 }} đánh giá</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-6">
                        <div class="cake-info">
                            <div class="cake-header">
                                <h1 class="cake-title">{{ cake.name }}</h1>
                                <p v-if="cake.englishName" class="cake-subtitle">{{ cake.englishName }}</p>
                            </div>

                            <div v-if="cake.description" class="cake-description">
                                <p>{{ cake.description }}</p>
                            </div>
                            <!-- <div class="action-section">
                                <div class="primary-actions">
                                    <button v-if="!userStore.isLogged" class="btn btn-login" @click="goLogin">
                                        <i class="fas fa-sign-in-alt"></i>
                                        <span>Đăng nhập để tương tác</span>
                                    </button>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </section>

            <section class="content-section">
                <div class="reviews-section">
                    <div class="section-header">
                        <h3 class="section-title">
                            Tất cả đánh giá ({{ reviews.length }})
                        </h3>
                    </div>

                    <div v-if="!reviews.length" class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-comment-slash"></i>
                        </div>
                        <h4>Chưa có đánh giá nào</h4>
                        <p>Hãy là người đầu tiên chia sẻ cảm nhận về chiếc bánh này!</p>
                    </div>

                    <div v-else class="reviews-grid">
                        <div v-for="rv in reviews" :key="rv._id" class="review-card">
                            <div class="review-header">
                                <div class="user-info">
                                    <div class="user-avatar">{{ getUserInitial(rv.user?.username) }}</div>
                                    <div class="user-details">
                                        <div class="user-name">{{ rv.user?.username || 'Người dùng' }}</div>
                                        <div class="review-date">{{ formatDate(rv.createdAt) }}</div>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    <div class="rating-stars">
                                        <span v-for="n in 5" :key="rv._id + '-s' + n">
                                            <i :class="(rv.rating >= n) ? 'fas fa-star' : 'far fa-star'"></i>
                                        </span>
                                    </div>
                                    <span class="rating-number">{{ rv.rating }}/5</span>
                                </div>
                            </div>
                            <div class="review-content">
                                <p>{{ rv.text || rv.comment}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="write-review-section">
                    <div class="review-form-card">
                        <div class="form-header">
                            <h3 class="form-title">
                                Viết đánh giá 
                            </h3>
                        </div>

                        <div v-if="!userStore.isLogged" class="login-prompt">
                            <div class="prompt-content">
                                <i class="fas fa-user-circle"></i>
                                <div>
                                    <p>Bạn cần đăng nhập để viết đánh giá</p>
                                    <button class="btn btn-login-small" @click="goLogin">Đăng nhập ngay</button>
                                </div>
                            </div>
                        </div>

                        <div v-else class="review-form">
                            <div class="rating-section">
                                <label class="section-label">Đánh giá của bạn</label>
                                <div class="rating-input-wrapper">
                                    <div class="interactive-stars" @mousemove="onStarMove" @mouseleave="onStarLeave"
                                        @click="onStarClick">
                                        <span v-for="n in 5" :key="'input-star-' + n" class="star-item">
                                            <i :class="visualStarClass(n)"></i>
                                        </span>
                                    </div>
                                    <div class="rating-display">{{ rating }} / 5 sao</div>
                                </div>
                            </div>

                            <div class="text-section">
                                <label for="reviewText" class="section-label">
                                    Nhận xét của bạn
                                    <span class="char-counter">{{ text.length }} / {{ textLimit }}</span>
                                </label>
                                <textarea id="reviewText" class="review-textarea" v-model="text" :maxlength="textLimit"
                                    :disabled="busyReview" placeholder="Chia sẻ cảm nhận của bạn về món bánh này..."
                                    rows="4"></textarea>
                            </div>

                            <div class="form-actions">
                                <button class="btn btn-submit" @click="submitReview" :disabled="busyReview">
                                    <!-- <i v-if="busyReview" class="fas fa-spinner fa-spin"></i>
                                    <i v-else class="fas fa-paper-plane"></i> -->
                                    {{ busyReview ? 'Đang gửi...' : 'Gửi đánh giá' }}
                                </button>
                                <button class="btn btn-reset" @click="resetReviewForm" :disabled="busyReview">
                                    <!-- <i class="fas fa-redo"></i> -->
                                    Làm mới
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div v-else class="error-state">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Không tìm thấy bánh</h3>
            <p>Xin lỗi, chúng tôi không thể tìm thấy thông tin về chiếc bánh này.</p>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CakeService from '@/services/cake.service'
import ReviewService from '@/services/review.service'
// import RecipeService from '@/services/recipe.service'
import { useUserStore } from '@/stores/userStore'
import FavoriteService from '@/services/favorite.service'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const id = route.params.id
const cake = ref(null)
const reviews = ref([])
// const recipes = ref([])
const loading = ref(true)

const busyFavorite = ref(false)
const busyReview = ref(false)

const rating = ref(5)       
const text = ref('')
const textLimit = 500


const ratingHover = ref(null)


const baseApi = import.meta.env.VITE_API_BASE_URL || ''
const imageUrl = computed(() => {
    const img = cake.value?.image
    if (!img) return baseApi + '/public/uploads/cakes/default.jpg'
    if (typeof img === 'string') return img.startsWith('http') ? img : baseApi + img
    if (img.main) return img.main.startsWith('http') ? img.main : baseApi + img.main
    return baseApi + '/public/uploads/cakes/default.jpg'
})

const isFavorited = computed(() => userStore.favoriteIds.includes(String(id)))
const favClass = computed(() => (isFavorited.value ? 'fas fa-heart' : 'far fa-heart'))



function formatRatingScore(avgRaw) {
    const avg = Number(avgRaw ?? cake.value?.rating?.average ?? 0)
    return avg > 0 ? avg.toFixed(1) : '0.0'
}


function getUserInitial(name) {
    return (name || 'U').charAt(0).toUpperCase()
}



function starClassForAverage(n, avgRaw) {
    const avg = Number(avgRaw ?? cake.value?.rating?.average ?? 0)
    if (avg >= n) return 'fas fa-star text-warning'
    if (avg >= (n - 0.5)) return 'fas fa-star-half-alt text-warning'
    return 'far fa-star text-muted'
}

function visualStarClass(n) {
    const current = ratingHover.value ?? rating.value
    if (current >= n) return 'fas fa-star'
    if (current >= (n - 0.5)) return 'fas fa-star-half-alt'
    return 'far fa-star'
}

function onStarMove(event) {
    const el = event.currentTarget
    if (!el) return
    const rect = el.getBoundingClientRect()
    const totalWidth = rect.width
    const x = event.clientX - rect.left
    let percent = Math.max(0, Math.min(1, x / totalWidth))
    let val = Math.round((percent * 5) * 2) / 2
    val = Math.max(0, Math.min(5, val))
    ratingHover.value = val
}

function onStarLeave() {
    ratingHover.value = null
}

function onStarClick(event) {
    if (ratingHover.value !== null) {
        rating.value = ratingHover.value
        ratingHover.value = null
        return
    }
    const el = event.currentTarget
    if (!el) return
    const rect = el.getBoundingClientRect()
    const totalWidth = rect.width
    const x = event.clientX - rect.left
    let percent = Math.max(0, Math.min(1, x / totalWidth))
    let val = Math.round((percent * 5) * 2) / 2
    val = Math.max(0, Math.min(5, val))
    rating.value = val
}



function formatDate(d) {
    if (!d) return ''
    const dt = new Date(d)
    return dt.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}


async function load() {
    loading.value = true

    await nextTick()
    window.scrollTo(0, 0)

    try {
        const res = await CakeService.get(id)
        cake.value = res?.data || res?.cake || res

        const rres = await ReviewService.get(id)
        reviews.value = Array.isArray(rres) ? rres : (rres?.data || rres?.reviews || rres || [])

        // const pres = await RecipeService.list({ limit: 50 })
        // const allRecipes = Array.isArray(pres) ? pres : (pres?.data || pres?.recipes || [])
        // recipes.value = allRecipes.filter(r => {
        //     const cakeField = r.cake || r.cakeId
        //     return String(cakeField?._id || cakeField) === String(id)
        // })

        await userStore.loadFavorites()
    } catch (err) {
        console.error('CakeDetail load error', err)
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Tải thông tin thất bại' })
    } finally {
        loading.value = false
    }
}


async function toggleFavorite() {
    if (!userStore.isLogged) {
        goLogin()
        return
    }
    if (busyFavorite.value) return
    busyFavorite.value = true
    try {
        if (!isFavorited.value) {
            const res = await FavoriteService.add(id)
            const payload = res?.data ?? res
            userStore.addFavoriteLocal(id, payload)
            toast.add({ severity: 'success', summary: 'Đã thêm', detail: 'Đã thêm vào yêu thích', life: 2000 })
        } else {
            await FavoriteService.remove(id)
            userStore.removeFavoriteLocal(id)
            toast.add({ severity: 'info', summary: 'Đã xóa', detail: 'Đã xóa khỏi yêu thích', life: 2000 })
        }
    } catch (err) {
        console.error('toggleFavorite detail', err)
        if (err?.response?.status === 409) {
            await userStore.loadFavorites()
        }
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Thao tác thất bại' })
    } finally {
        busyFavorite.value = false
    }
}


function resetReviewForm() {
    rating.value = 5
    text.value = ''
}
function goLogin() {
    router.push({ name: 'log-in', query: { redirect: router.currentRoute.value.fullPath } })
}


async function submitReview() {
    if (!userStore.isLogged) {
        goLogin()
        return
    }
    if (busyReview.value) return

    const r = Number(rating.value)
    const t = String(text.value || '').trim()
    if (!r || r < 0.5 || r > 5) {
        toast.add({ severity: 'warn', summary: 'Sai dữ liệu', detail: 'Vui lòng chọn 0.5 - 5 sao' })
        return
    }
    if (t.length > textLimit) {
        toast.add({ severity: 'warn', summary: 'Sai dữ liệu', detail: `Đoạn nhận xét tối đa ${textLimit} ký tự` })
        return
    }

    busyReview.value = true
    try {
        const payload = {
            cakeId: id,
            rating: r,
            comment: t,
        }
        const res = await ReviewService.create(payload)
        const created = res?.data ?? res

        const toPush = created || { ...payload, createdAt: new Date().toISOString(), user: userStore.user }
        reviews.value = [toPush, ...reviews.value]


        try {
            const cres = await CakeService.get(id)
            cake.value = cres?.data || cres?.cake || cres
        } catch (e) {
            console.warn('Could not refresh cake after review', e)
        }

        toast.add({ severity: 'success', summary: 'Cảm ơn', detail: 'Đã gửi đánh giá', life: 2500 })
        resetReviewForm()
    } catch (err) {
        console.error('submitReview error', err)
        if (err?.response?.status === 409) {
            toast.add({ severity: 'warn', summary: 'Đã có', detail: 'Bạn đã đánh giá bánh này rồi' })
            await load()
        } else if (err?.response?.status === 401) {
            toast.add({ severity: 'warn', summary: 'Cần đăng nhập', detail: 'Vui lòng đăng nhập để gửi đánh giá' })
            goLogin()
        } else {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Gửi đánh giá thất bại' })
        }
    } finally {
        busyReview.value = false
    }
}

onMounted(load)
</script>

<style scoped>

.cake-detail-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
}


.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1rem;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    color: #666;
    margin: 0;
}


.hero-section {
    margin-bottom: 2rem;
}

.image-container {
    position: relative;
    height: 100%;
}

.main-image-wrapper {
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    aspect-ratio: 5/3;

}

.main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.image-overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.main-image-wrapper:hover .image-overlay {
    opacity: 1;
}

.favorite-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.favorite-btn:hover {
    transform: scale(1.1);
    background: white;
}

.favorite-btn i {
    font-size: 1.25rem;
    color: #e74c3c;
}

.rating-badge {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rating-score {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
}

.score-number {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2c3e50;
}

.rating-stars i {
    color: #f39c12;
    font-size: 0.875rem;
}

.rating-count {
    font-size: 0.75rem;
    color: #7f8c8d;
    text-align: center;
}


.cake-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem 0;
}

.cake-header {
    margin-bottom: 1.5rem;
}

.cake-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    line-height: 1.2;
}

.cake-subtitle {
    font-size: 1rem;
    color: #7f8c8d;
    font-style: italic;
    margin: 0;
}

.cake-description {
    margin-bottom: 2rem;
}

.cake-description p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #5a6c7d;
    margin: 0;
    text-align: justify;

}


.action-section {
    margin-bottom: 2rem;
}

.primary-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    border: none;
    border-radius: 10px;
    padding: 0.65rem 1.25rem;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.btn-login,
.btn-login-small {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}
.btn-login-small{
    margin: auto;
}

.btn-login:hover,
.btn-login-small:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.btn-login-small {
    padding: 0.45rem 0.9rem;
    font-size: 0.85rem;
}


.tab-content {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}


.write-review-section {
    margin-bottom: 3rem;
}

.review-form-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #ecf0f1;
}

.form-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ecf0f1;
}

.form-title {
    font-size: large;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.form-title i {
    color: #3498db;
}


.login-prompt {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 12px;
    border: 2px dashed #dee2e6;
}

.prompt-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.prompt-content i {
    font-size: 3rem;
    color: #6c757d;
}

.prompt-content p {
    margin: 0;
    color: #495057;
    font-size: 1rem;
}


.review-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.rating-section,
.text-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.section-label {
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
}

.char-counter {
    font-size: 0.875rem;
    color: #7f8c8d;
    font-weight: 400;
}

.rating-input-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.interactive-stars {
    display: flex;
    gap: 0.25rem;
    cursor: pointer;
    user-select: none;
    padding: 0.5rem 0;
}

.star-item i {
    font-size: 1.75rem;
    color: #dee2e6;
    transition: all 0.2s ease;
}

.star-item i.fas {
    color: #f39c12;
}

.star-item i.fa-star-half-alt {
    color: #f39c12;
}

.rating-display {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    padding: 0.45rem 0.9rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.review-textarea {
    border: 2px solid #dee2e6;
    border-radius: 10px;
    padding: 0.9rem;
    font-size: 0.95rem;
    resize: vertical;
    transition: all 0.3s ease;
    font-family: inherit;
}

.review-textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.review-textarea::placeholder {
    color: #adb5bd;
}


.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
    margin: auto;
}

.btn-submit {
    background: linear-gradient(135deg, #27ae60, #229954);
    color: white;
    box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
}

.btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.btn-reset {
    background: #6c757d;
    color: white;
}

.btn-reset:hover:not(:disabled) {
    background: #5a6268;
    transform: translateY(-1px);
}


.reviews-section {
    margin-top: 3rem;
}

.section-header {
    margin-bottom: 2rem;
}

.section-title {
    font-size:large;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-title i {
    color: #3498db;
}


.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #7f8c8d;
}

.empty-icon i {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h4 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.empty-state p {
    font-size: 1rem;
    margin: 0;
}


.reviews-grid {
    display: grid;
    gap: 1.5rem;
}

.review-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #ecf0f1;
    transition: all 0.3s ease;
}

.review-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3498db, #2980b9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.125rem;
}

.user-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.user-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
}

.review-date {
    font-size: 0.875rem;
    color: #7f8c8d;
}

.review-rating {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
}

.review-rating .rating-stars {
    display: flex;
    gap: 0.125rem;
}

.review-rating .rating-stars i {
    font-size: 1rem;
    color: #f39c12;
}

.review-rating .rating-stars i.far {
    color: #dee2e6;
}

.rating-number {
    font-size: 0.875rem;
    font-weight: 600;
    color: #2c3e50;
}

.review-content p {
    margin: 0;
    line-height: 1.6;
    color: #5a6c7d;
    font-size: 0.95rem;
}


.error-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #e74c3c;
}

.error-icon i {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.7;
}

.error-state h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.error-state p {
    font-size: 1rem;
    margin: 0;
    color: #7f8c8d;
}


@media (max-width: 768px) {
    .cake-detail-page {
        padding: 0.5rem;
    }

    .cake-title {
        font-size: 1.75rem;
    }

    .primary-actions {
        flex-direction: column;
    }

    .btn {
        justify-content: center;
    }

    .review-form-card {
        padding: 1.5rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .review-rating {
        align-items: flex-start;
        flex-direction: row;
        gap: 0.5rem;
    }
}

@media (max-width: 480px) {
    .rating-input-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .interactive-stars {
        align-self: center;
    }

    .prompt-content i {
        font-size: 2rem;
    }

    .empty-icon i {
        font-size: 3rem;
    }

    .error-icon i {
        font-size: 3rem;
    }
}
</style>
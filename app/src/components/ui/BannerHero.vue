<template>
    <section class="banner-hero">
        <div class="banner-viewport" ref="viewport">
            <div class="banner-track" :style="trackStyle">
                <div v-for="(img, i) in slides" :key="i" class="banner-slide" :aria-hidden="i !== active">
                    <img :src="img" class="banner-image" :alt="altTexts[i] || ('Banner ' + (i + 1))" loading="lazy" />
                </div>
            </div>

            <button v-if="showArrows && slides.length > 1" class="arrow arrow-left" @click="prev"
                aria-label="Previous slide">
                ‹
            </button>
            <button v-if="showArrows && slides.length > 1" class="arrow arrow-right" @click="next"
                aria-label="Next slide">
                ›
            </button>
        </div>

        <div v-if="showDots && slides.length > 1" class="banner-dots">
            <button v-for="(s, idx) in slides" :key="idx" :class="['dot', { active: idx === active }]"
                @click="goTo(idx)" :aria-label="`Go to slide ${idx + 1}`" />
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({

    images: { type: Array, default: null },
    autoPlay: { type: Boolean, default: true },
    interval: { type: Number, default: 4000 },
    showArrows: { type: Boolean, default: true },
    showDots: { type: Boolean, default: true },
    loop: { type: Boolean, default: true },
    altTexts: { type: Array, default: () => [] },


    forceSingle: { type: Boolean, default: false }
})

const active = ref(0)
const slides = ref([])
const timer = ref(null)
const viewport = ref(null)


function loadViteImages() {

    if (Array.isArray(props.images) && props.images.length) {
        slides.value = props.images.slice()
        if (props.forceSingle) slides.value = slides.value.slice(0, 1)
        return
    }

    try {

        const modules = import.meta.glob('../../assets/carousel/*.{jpg,jpeg,png,webp}', { eager: true })
        const arr = Object.values(modules).map(m => m?.default || m).filter(Boolean)
        slides.value = arr
        if (props.forceSingle && slides.value.length) slides.value = [slides.value[0]]
    } catch (e) {
        slides.value = []

        console.warn('BannerHero: import.meta.glob failed', e)
    }
}


function startAuto() {
    stopAuto()
    if (!props.autoPlay || props.forceSingle || slides.value.length <= 1) return
    timer.value = setInterval(() => next(), Math.max(800, props.interval))
}
function stopAuto() {
    if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }
}

function next() {
    if (!slides.value.length) return
    active.value = (active.value >= slides.value.length - 1)
        ? (props.loop ? 0 : slides.value.length - 1)
        : active.value + 1
}
function prev() {
    if (!slides.value.length) return
    active.value = (active.value <= 0)
        ? (props.loop ? slides.value.length - 1 : 0)
        : active.value - 1
}
function goTo(i) {
    active.value = Math.max(0, Math.min(i, slides.value.length - 1))
}

onMounted(() => {
    loadViteImages()

    if (slides.value.length === 0) active.value = 0
    else if (active.value >= slides.value.length) active.value = 0

    startAuto()

    if (viewport.value) {
        viewport.value.addEventListener('mouseenter', stopAuto)
        viewport.value.addEventListener('mouseleave', startAuto)
    }
})

onUnmounted(() => {
    stopAuto()
    if (viewport.value) {
        viewport.value.removeEventListener('mouseenter', stopAuto)
        viewport.value.removeEventListener('mouseleave', startAuto)
    }
})


watch(
    () => [props.autoPlay, props.interval, slides.value.length, props.forceSingle],
    () => startAuto()
)


const trackStyle = computed(() => ({
    transform: `translateX(-${active.value * 100}%)`,
    transition: slides.value.length > 1 ? 'transform 420ms ease' : 'none'
}))

const altTexts = props.altTexts
</script>

<style scoped>
.banner-hero {
    width: 100%;
    padding-bottom: 6px;
}

.banner-viewport {
    position: relative;
    overflow: hidden;
    display: block;
}


.banner-track {
    display: flex;
    align-items: center;
    will-change: transform;
}

.banner-slide {
    flex: 0 0 100%;
    display: block;
    position: relative;
    padding-top: 50%;
    overflow: hidden;
    align-items: center;
    justify-content: center;
}


.banner-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: filter 0.3s ease, transform 0.3s ease;
}


.banner-viewport:hover .banner-image {
    filter: none;
}


.arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 30;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    opacity: 0;
    transition: opacity 0.3s ease, background 0.3s ease;
}

.arrow:hover {
    background: rgba(255, 255, 255, 1);
    color: #000;
}

.banner-viewport:hover .arrow {
    opacity: 1;
}

.arrow-left {
    left: 12px;
}

.arrow-right {
    right: 12px;
}

.banner-dots {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 10px;
    padding-bottom: 8px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.12);
    border: none;
    cursor: pointer;
}


.dot.active {
    background: rgba(0, 0, 0, 0.7);
}

@media (max-width: 992px) {
    .banner-slide {
        padding-top: 50.00%;
    }
}

@media (max-width: 576px) {
    .banner-slide {
        padding-top: 75%;
    }

    .arrow {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }
}
</style>

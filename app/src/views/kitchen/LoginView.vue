<template>
  <main class="login-page">
    <div class="login-wrapper">
      <div class="login-card card">
        <div class="card-body">
          <div class="brand">
            <p class="brand-sub">Đăng nhập</p>
          </div>

          <form @submit.prevent="onSubmit" novalidate class="mt-3">
            <div class="mb-3">
              <label class="form-label visually-hidden" for="username">Tên đăng nhập</label>
              <input id="username" v-model.trim="username" class="form-control" placeholder="Tên đăng nhập"
                autocomplete="username" />
            </div>

            <div class="mb-3">
              <label class="form-label visually-hidden" for="password">Mật khẩu</label>
              <input id="password" v-model="password" type="password" class="form-control" placeholder="Mật khẩu"
                autocomplete="current-password" />
            </div>

    
            <div class="login-actions mt-2">
              <button class="btn btn-primary btn-sm submit-btn" :disabled="submitting" type="submit">
                <span v-if="!submitting">Đăng nhập</span>
                <span v-else>Đang xử lý…</span>
              </button>
            </div>

            <div class="mt-3 text-center small muted links-row">
              <router-link to="/" class="link-muted">Quay về Trang chủ</router-link>
              <span class="divider"> | </span>  
              <router-link :to="{ name: 'register' }" class="link-muted">Chưa có tài khoản? Đăng ký</router-link>


            </div>
          </form>
        </div>
      </div>

      <div class="login-help small text-center mt-3 text-muted">
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'

const username = ref('')
const password = ref('')
const submitting = ref(false)
const router = useRouter()
const route = useRoute()
const toast = useToast()
const userStore = useUserStore()

async function onSubmit() {
  if (!username.value || !password.value) {
    toast.add({ severity: 'warn', summary: 'Thiếu thông tin', detail: 'Vui lòng nhập tên đăng nhập và mật khẩu', life: 2500, group: 'tr' })
    return
  }

  submitting.value = true
  try {
    const user = await userStore.login({ username: username.value, password: password.value })

    if (!userStore.user && typeof userStore.loadProfile === 'function') {
      try {
        await userStore.loadProfile()
      } catch (e) {
        console.warn('loadProfile after login failed', e)
      }
    }

    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công', life: 3000, group: 'tr' })

    const role = user?.role || userStore.user?.role
    if (role && String(role).toLowerCase() === 'admin') {
      router.push({ path: '/dashboard' })
    } else {
      const redirect = route.query.redirect || '/'
      const target = Array.isArray(redirect) ? redirect[0] : redirect
      router.push(target)
    }
  } catch (err) {
    console.error('login error', err)
    toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Sai tài khoản hoặc mật khẩu', life: 3500, group: 'tr' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>

.login-page {
  min-height: calc(100vh - 0px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.25rem 1rem;
  background: #FFFDF3
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  text-align: center;
}


.login-card {
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(20, 30, 40, 0.06);
  border: 1px solid rgba(15, 23, 36, 0.04);
  overflow: hidden;
  background: #fff;


  transition: none !important;
}

.login-card:hover {
  transform: none !important;
  box-shadow: 0 8px 28px rgba(20, 30, 40, 0.06) !important;
}

/* Brand */
.brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.brand-link {
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--text);
  text-decoration: none;
}

.brand-sub {
  margin: auto;
  color: black;
  font-size: large;
  font-weight: bold;
  color: #ff6b35;
}

.form-control:focus {
  outline: none;
  border-color: rgba(255, 107, 53, 0.85);
  box-shadow: 0 6px 18px rgba(255, 107, 53, 0.06);
}


.login-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
}

.back-btn {
  padding: 0.36rem 0.6rem;
  border-radius: 8px;
  font-weight: 600;
  color: var(--text);
  background: transparent;
  border: 1px solid rgba(15, 23, 36, 0.06);
  line-height: 1;
}


.submit-btn {
  padding: 0.38rem 0.9rem;
  border-radius: 8px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.login-card .btn {

  transition: background-color .12s ease, opacity .12s ease;
}


.btn-primary {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border: none;
  color: var(--accent-contrast);
}


.links-row {
  display: inline-flex;
  gap: .6rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

.link-muted {
  color: #6b7280;
  text-decoration: none;
  font-weight: 600;
}

.link-muted:hover {
  color: var(--accent);
  text-decoration: underline;
}


.links-row .divider {
  color: #c7cdd6;
}


.login-help {
  color: #94a3b8;
}


.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}


@media (max-width: 480px) {
  .login-page {
    padding: 1.2rem;
  }

  .brand-link {
    font-size: 1rem;
  }

  .login-actions {
    gap: 0.5rem;
  }

  .back-btn,
  .submit-btn {
    padding-left: .6rem;
    padding-right: .6rem;
  }
}
</style>

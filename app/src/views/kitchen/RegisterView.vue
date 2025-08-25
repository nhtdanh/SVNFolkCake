<template>
  <main class="auth-page">
    <div class="auth-wrapper">
      <div class="auth-card card">
        <div class="card-body">
          <div class="brand">
            <p class="brand-sub">Đăng ký</p>
          </div>

          <form @submit.prevent="onSubmit" novalidate class="mt-3">
            <div class="mb-3">
              <label class="form-label visually-hidden" for="username">Tên đăng nhập</label>
              <input id="username" v-model.trim="username" class="form-control" placeholder="Tên đăng nhập"
                autocomplete="username" />
              <div v-if="submitted && errors.username" class="text-danger small mt-1">{{ errors.username }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label visually-hidden" for="email">Email</label>
              <input id="email" v-model.trim="email" class="form-control" placeholder="Email" autocomplete="email" />
              <div v-if="submitted && errors.email" class="text-danger small mt-1">{{ errors.email }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label visually-hidden" for="password">Mật khẩu</label>
              <input id="password" v-model="password" type="password" class="form-control" placeholder="Mật khẩu"
                autocomplete="new-password" />
              <div v-if="submitted && errors.password" class="text-danger small mt-1">{{ errors.password }}</div>
            </div>


            <div class="auth-actions mt-2">
              <button class="btn btn-primary btn-sm submit-btn" :disabled="submitting" type="submit">
                <span v-if="!submitting">Đăng ký</span>
                <span v-else>Đang xử lý…</span>
              </button>
            </div>

            <div class="mt-3 text-center small muted links-row">
              <router-link :to="{ name: 'log-in' }" class="link-muted">Đã có tài khoản? Đăng nhập</router-link>
              <span class="divider"> | </span>
              <router-link to="/" class="link-muted">Trang chủ</router-link>
            </div>
          </form>
        </div>
      </div>

      <div class="auth-help small text-center mt-3 text-muted">

      </div>
    </div>
  </main>
</template>

<script setup>

import { ref, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import AuthService from '@/services/auth.service'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const submitting = ref(false)
const submitted = ref(false)
const toast = useToast()
const router = useRouter()


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const usernameRegex = /^[a-zA-Z0-9_]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

const errors = reactive({
  email: '',
  username: '',
  password: '',
})

function validateEmail() {
  if (!email.value) {
    errors.email = 'Email bắt buộc'
    return false
  }
  if (!emailRegex.test(email.value)) {
    errors.email = 'Email không đúng định dạng'
    return false
  }
  errors.email = ''
  return true
}
function validateUsername() {
  if (!username.value) {
    errors.username = 'Tên đăng nhập bắt buộc'
    return false
  }
  if (username.value.length < 6 || username.value.length > 20) {
    errors.username = 'Tên đăng nhập phải từ 6 đến 20 ký tự'
    return false
  }
  if (!usernameRegex.test(username.value)) {
    errors.username = 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới'
    return false
  }
  errors.username = ''
  return true
}
function validatePassword() {
  if (!password.value) {
    errors.password = 'Mật khẩu bắt buộc'
    return false
  }
  if (!passwordRegex.test(password.value)) {
    errors.password = 'Mật khẩu ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt'
    return false
  }
  errors.password = ''
  return true
}

async function onSubmit() {
  submitted.value = true


  const okUsername = validateUsername()
  const okEmail = validateEmail()
  const okPassword = validatePassword()

  if (!okUsername || !okEmail || !okPassword) {
    toast.add({ severity: 'warn', summary: 'Lỗi dữ liệu', detail: 'Vui lòng sửa các lỗi trước khi gửi', life: 3000, group: 'tr' })
    return
  }

  submitting.value = true
  try {
    await AuthService.register({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    toast.add({ severity: 'success', summary: 'Đăng ký thành công', detail: 'Vui lòng đăng nhập', life: 3000, group: 'tr' })
    router.push({ name: 'log-in' })
  } catch (err) {
    console.error('register error', err)

    const detail =
      err?.response?.data?.message ||
      (err?.response?.data?.errors && JSON.stringify(err.response.data.errors)) ||
      err?.message ||
      'Vui lòng thử lại'


    if (err?.response?.data?.errors && typeof err.response.data.errors === 'object') {
      const s = err.response.data.errors
      if (s.email) errors.email = Array.isArray(s.email) ? s.email.join(', ') : String(s.email)
      if (s.username) errors.username = Array.isArray(s.username) ? s.username.join(', ') : String(s.username)
      if (s.password) errors.password = Array.isArray(s.password) ? s.password.join(', ') : String(s.password)
    } else if (err?.response?.data?.message) {
      toast.add({ severity: 'error', summary: 'Đăng ký thất bại', detail: detail, life: 4000, group: 'tr' })
    } else {
      toast.add({ severity: 'error', summary: 'Đăng ký thất bại', detail, life: 4000, group: 'tr' })
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>

.auth-page {
  min-height: calc(100vh - 0px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.25rem 1rem;
  background: #FFFDF3;
}


.auth-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}


.auth-card {
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(20, 30, 40, 0.06);
  border: 1px solid rgba(15, 23, 36, 0.04);
  overflow: hidden;
  background: #fff;
  transition: none !important;
}

.auth-card:hover {
  transform: none !important;
  box-shadow: 0 8px 28px rgba(20, 30, 40, 0.06) !important;
}


.brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.brand-sub {
  margin: auto;
  color: #ff6b35;
  font-size: 1.25rem;
  font-weight: 700;
}


.form-control {
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 36, 0.06);
  background: #fbfdff;
  font-size: 0.95rem;
}

.form-control:focus {
  outline: none;
  border-color: rgba(255, 107, 53, 0.85);
  box-shadow: 0 6px 18px rgba(255, 107, 53, 0.06);
}


.auth-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
}

.submit-btn {
  padding: 0.38rem 0.9rem;
  border-radius: 8px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}


.auth-card .btn {
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

.auth-help {
  color: #94a3b8;
  max-width: 440px;
  margin: 0 auto;
  padding-top: 6px;
}


.text-danger {
  line-height: 1.1;
  color: #dc2626;
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
  .auth-page {
    padding: 1.2rem;
  }

  .brand-sub {
    font-size: 1.1rem;
  }

  .auth-wrapper {
    max-width: 420px;
  }

  .submit-btn {
    padding-left: .6rem;
    padding-right: .6rem;
  }
}
</style>

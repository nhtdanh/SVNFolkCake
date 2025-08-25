<template>
  <main class="container py-4">
    <h4>Hồ sơ của tôi</h4>
    <div v-if="user" class="row">
      <div class="col-md-4">
        <img :src="avatarUrl" class="img-fluid rounded mb-2" alt="avatar" />
        <input type="file" @change="onAvatar" class="form-control" />
      </div>
      <div class="col-md-8">
        <div class="mb-2">
          <label class="form-label small">Tên</label>
          <input v-model="form.username" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label small">Email</label>
          <input v-model="form.email" class="form-control" />
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="save">Lưu</button>
        </div>

        <hr />

        <h6>Đổi mật khẩu</h6>
        <div class="mb-2"><input v-model="oldPassword" type="password" class="form-control" placeholder="Mật khẩu cũ" /></div>
        <div class="mb-2"><input v-model="newPassword" type="password" class="form-control" placeholder="Mật khẩu mới" /></div>
        <button class="btn btn-warning" @click="changePassword">Đổi mật khẩu</button>
      </div>
    </div>
    <div v-else class="text-muted">Vui lòng đăng nhập</div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/userStore'
import UserService from '@/services/user.service'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const form = ref({ username: '', email: '' })
const oldPassword = ref('')
const newPassword = ref('')
const avatarFile = ref(null)
const toast = useToast()

const avatarUrl = computed(() => {
  if (!userStore.user) return '/public/default-avatar.png'
  const av = userStore.user.avatar || ''
  if (!av) return '/public/default-avatar.png'
  return av.startsWith('http') ? av : import.meta.env.VITE_API_BASE_URL + av
})

onMounted(async () => {
  if (!userStore.user) await userStore.loadProfile()
  form.value.username = userStore.user?.username || ''
  form.value.email = userStore.user?.email || ''
})

async function save() {
  try {
    await UserService.updateMe({ username: form.value.username, email: form.value.email })
    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật hồ sơ thành công', life: 3000, group: 'tr' })
    await userStore.loadProfile()
  } catch (err) {
    console.error(err)
    toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Không thể cập nhật hồ sơ', life: 3500, group: 'tr' })
  }
}

function onAvatar(e) { avatarFile.value = e.target.files[0]; uploadAvatar() }

async function uploadAvatar() {
  if (!avatarFile.value) return
  try {
    await UserService.uploadAvatar(avatarFile.value)
    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đã đổi avatar', life: 3000, group: 'tr' })
    await userStore.loadProfile()
  } catch (err) {
    console.error(err)
    toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Upload avatar lỗi', life: 3500, group: 'tr' })
  }
}

async function changePassword() {
  try {
    await UserService.changePassword({ oldPassword: oldPassword.value, newPassword: newPassword.value })
    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Đổi mật khẩu thành công', life: 3000, group: 'tr' })
    oldPassword.value = ''; newPassword.value = ''
  } catch (err) {
    console.error(err)
    toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Sai mật khẩu cũ', life: 3500, group: 'tr' })
  }
}
</script>

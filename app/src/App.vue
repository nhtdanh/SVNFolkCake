<script setup>
import Toast from 'primevue/toast'
</script>

<template>
  <div class="app" id="app">
    <div class="wrap__app">
      <router-view />
    </div>
    <Toast position="top-right" group="tr" />
    <Toast position="bottom-right" group="br" />
  </div>
</template>
<style scoped>
html,
body,
#app {
  background-color: #FFFDF3;
  margin: 0;
  padding: 0;
  min-height: 100%;
}
</style>

<template>
  <div>
    <NavbarApp />
    <b-container class="mt-4">
      <router-view />
    </b-container>
    <ToastManager ref="toasts" />
  </div>
</template>

<script>
import NavbarApp from './components/NavbarApp.vue';

export default {
  components: { NavbarApp }
};
</script>

<style>
body { background: #f8f9fa; }
</style>

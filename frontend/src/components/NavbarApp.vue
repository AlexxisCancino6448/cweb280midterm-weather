<template>
  <b-navbar toggleable="lg" type="light" variant="light" class="bg-white shadow-sm">
    <b-container>
      <b-navbar-brand href="#">Sunny Skies</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ms-auto">
          <b-nav-item v-if="!auth.isAuthenticated" to="/login">Login</b-nav-item>
          <b-nav-item v-if="!auth.isAuthenticated" to="/register">Register</b-nav-item>

          <b-nav-item v-if="auth.isAuthenticated" to="/">Dashboard</b-nav-item>
          <b-nav-item v-if="auth.isAuthenticated" to="/locations">Locations</b-nav-item>
          <b-nav-item v-if="auth.isAuthenticated" to="/profile">Profile</b-nav-item>
          <b-nav-item v-if="auth.isAuthenticated" @click="doLogout">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = useAuthStore();
    auth.loadFromStorage();
    const router = useRouter();
    function doLogout() {
      auth.logout();
      router.push({ name: 'Login' });
    }
    return { auth, doLogout };
  }
};
</script>

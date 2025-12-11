<template>
  <b-row class="justify-content-center">
    <b-col cols="12" md="6">
      <b-card title="Login">
        <b-form @submit.prevent="doLogin">
          <b-form-group label="Email">
            <b-form-input v-model="email" type="email" required />
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input v-model="password" type="password" required />
          </b-form-group>
          <b-button type="submit" variant="primary" :disabled="loading">
            <span v-if="loading">Signing in...</span>
            <span v-else>Login</span>
          </b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const auth = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    async function doLogin() {
      loading.value = true;
      try {
        await auth.login(email.value, password.value);
        const redirect = route.query.redirect || '/';
        router.push(redirect);
      } catch (err) {
        alert(err.message || 'Login failed');
      } finally {
        loading.value = false;
      }
    }

    return { email, password, loading, doLogin };
  }
};
</script>

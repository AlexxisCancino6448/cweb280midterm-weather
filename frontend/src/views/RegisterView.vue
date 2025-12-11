<template>
  <b-row class="justify-content-center">
    <b-col cols="12" md="6">
      <b-card title="Register">
        <b-form @submit.prevent="doRegister">
          <b-form-group label="Username">
            <b-form-input v-model="username" required />
          </b-form-group>
          <b-form-group label="Email">
            <b-form-input v-model="email" type="email" required />
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input v-model="password" type="password" required />
          </b-form-group>
          <b-button type="submit" variant="success" :disabled="loading">
            <span v-if="loading">Creating...</span>
            <span v-else>Register</span>
          </b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const auth = useAuthStore();
    const router = useRouter();

    async function doRegister() {
      loading.value = true;
      try {
        await auth.register(username.value, email.value, password.value);
        router.push('/');
      } catch (err) {
        alert(err.message || 'Registration failed');
      } finally {
        loading.value = false;
      }
    }

    return { username, email, password, loading, doRegister };
  }
};
</script>

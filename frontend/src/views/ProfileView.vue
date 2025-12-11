<template>
  <b-row class="justify-content-center">
    <b-col cols="12" md="6">
      <b-card title="Profile">
        <b-form @submit.prevent="save">
          <b-form-group label="Username">
            <b-form-input v-model="form.username" required />
          </b-form-group>
          <b-form-group label="Default location">
            <b-form-input v-model="form.default_location" />
          </b-form-group>
          <b-form-group label="Units">
            <b-form-select v-model="form.units" :options="unitOptions" />
          </b-form-group>
          <b-button type="submit" variant="primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

export default {
  setup() {
    const auth = useAuthStore();
    const form = ref({ username: '', default_location: '', units: 'm' });
    const unitOptions = [{ value: 'm', text: 'Metric' }, { value: 'i', text: 'Imperial' }];
    const saving = ref(false);

    async function load() {
      const res = await api.get('/api/users/me');
      form.value = { ...res.data };
    }
    onMounted(load);

    async function save() {
      saving.value = true;
      try {
        await api.put('/api/users/me', form.value);
        const me = await api.get('/api/users/me');
        auth.user = me.data;
        auth.saveToStorage();
        alert('Saved');
      } catch (err) {
        alert(err.message || 'Save failed');
      } finally {
        saving.value = false;
      }
    }

    return { form, unitOptions, saving, save };
  }
};
</script>

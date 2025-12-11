<template>
  <div>
    <b-row>
      <b-col md="6">
        <b-card title="Quick Weather Check">
          <b-form @submit.prevent="fetchWeather">
            <b-form-group label="Location">
              <b-form-input v-model="query" placeholder="e.g., Regina" required />
            </b-form-group>
            <b-form-group label="Units">
              <b-form-select v-model="units" :options="unitOptions" />
            </b-form-group>
            <b-button type="submit" variant="primary" :disabled="loading">
              {{ loading ? 'Checking...' : 'Check Weather' }}
            </b-button>
          </b-form>
        </b-card>
      </b-col>

      <b-col md="6">
        <b-card title="Saved Locations">
          <div v-if="locations.length === 0" class="text-muted">No saved locations yet.</div>
          <LocationCard v-for="loc in locations" :key="loc.id" :location="loc" @use="useLocation" @edit="openEdit" @delete="confirmDelete" />
          <b-button variant="success" class="mt-2" @click="openAdd">Add Location</b-button>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col>
        <b-card title="Recent Snapshots">
          <div v-if="snapshots.length === 0" class="text-muted">No snapshots yet.</div>
          <b-list-group>
            <b-list-group-item v-for="s in snapshots" :key="s.id">
              <strong>{{ s.location_query }}</strong> — {{ s.temperature ?? 'N/A' }}°; {{ s.fetched_at ? new Date(s.fetched_at).toLocaleString() : '' }}
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>
    </b-row>

    <LocationForm ref="form" @save="saveLocation" />
    <ConfirmModal ref="confirm" message="Delete this location?" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import LocationCard from '../components/LocationCard.vue';
import LocationForm from '../components/LocationForm.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

export default {
  components: { LocationCard, LocationForm, ConfirmModal },
  setup() {
    const query = ref('');
    const units = ref('m');
    const unitOptions = [{ value: 'm', text: 'Metric' }, { value: 'i', text: 'Imperial' }];
    const loading = ref(false);
    const locations = ref([]);
    const snapshots = ref([]);
    const form = ref(null);
    const confirm = ref(null);

    async function load() {
      try {
        const locRes = await api.get('/api/locations');
        locations.value = locRes.data || [];
        // optional endpoint for snapshots list; if not present backend may return 404
        try {
          const snapRes = await api.get('/api/weather/snapshots');
          snapshots.value = snapRes.data || [];
        } catch {
          snapshots.value = [];
        }
      } catch (err) {
        console.error(err);
      }
    }

    onMounted(load);

    async function fetchWeather() {
      loading.value = true;
      try {
        await api.get(`/api/weather?query=${encodeURIComponent(query.value)}&units=${units.value}`);
        await load();
      } catch (err) {
        alert(err.message || 'Failed to fetch weather');
      } finally {
        loading.value = false;
      }
    }

    function openAdd() { form.value.open(); }
    function openEdit(loc) { form.value.open(loc); }

    async function saveLocation(payload) {
      try {
        if (payload.id) {
          await api.put(`/api/locations/${payload.id}`, payload);
        } else {
          await api.post('/api/locations', payload);
        }
        await load();
      } catch (err) {
        alert(err.message || 'Failed to save');
      }
    }

    async function confirmDelete(loc) {
      const ok = await confirm.value.open();
      if (!ok) return;
      try {
        await api.del(`/api/locations/${loc.id}`);
        await load();
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    }

    function useLocation(loc) {
      query.value = loc.query;
    }

    return { query, units, unitOptions, loading, locations, snapshots, form, confirm, fetchWeather, openAdd, openEdit, saveLocation, confirmDelete, useLocation };
  }
};
</script>

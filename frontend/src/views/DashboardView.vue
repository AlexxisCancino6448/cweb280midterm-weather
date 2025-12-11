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
          <LocationCard
            v-for="loc in locations"
            :key="loc.id"
            :location="loc"
            @use="useLocation"
            @edit="openEdit"
            @delete="confirmDelete"
          />
          <b-button variant="success" class="mt-2" @click="openAdd">Add Location</b-button>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col>
        <!-- SnapshotsList handles its own rendering and uses the snapshots store -->
        <SnapshotsList />
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
import SnapshotsList from '../components/SnapshotsList.vue';
import { useSnapshotsStore } from '../stores/snapshots'; // <-- import snapshots store

export default {
  components: { LocationCard, LocationForm, ConfirmModal, SnapshotsList },
  setup() {
    const query = ref('');
    const units = ref('m');
    const unitOptions = [{ value: 'm', text: 'Metric' }, { value: 'i', text: 'Imperial' }];
    const loading = ref(false);
    const locations = ref([]);
    const form = ref(null);
    const confirm = ref(null);

    const snapshotsStore = useSnapshotsStore(); // <-- create store instance

    async function load() {
      try {
        const locRes = await api.get('/api/locations');
        locations.value = locRes.data || [];
        // refresh snapshots on initial load so the list is up-to-date
        await snapshotsStore.fetchSnapshots();
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    }

    onMounted(load);

    async function fetchWeather() {
      loading.value = true;
      try {
        // call the weather endpoint (this may also create a snapshot on the server)
        await api.get(`/api/weather?query=${encodeURIComponent(query.value)}&units=${units.value}`);

        // reload locations if needed
        await load();

        // refresh snapshots so the new snapshot (created by the weather fetch) appears
        await snapshotsStore.fetchSnapshots();
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

    return {
      query,
      units,
      unitOptions,
      loading,
      locations,
      form,
      confirm,
      fetchWeather,
      openAdd,
      openEdit,
      saveLocation,
      confirmDelete,
      useLocation
    };
  }
};
</script>

<style>
body { background: #f8f9fa; }
</style>

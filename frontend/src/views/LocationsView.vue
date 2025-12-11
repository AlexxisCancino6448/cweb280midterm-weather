<template>
  <div>
    <b-row>
      <b-col>
        <b-card title="Manage Saved Locations">
          <b-input-group class="mb-2">
            <b-form-input v-model="filter" placeholder="Search locations..." />
            <b-button @click="openAdd">Add</b-button>
          </b-input-group>

          <b-table :items="filtered" :fields="fields" small responsive>
            <template #cell(actions)="row">
              <b-button size="sm" variant="primary" @click="use(row.item)">Use</b-button>
              <b-button size="sm" variant="warning" class="ms-1" @click="edit(row.item)">Edit</b-button>
              <b-button size="sm" variant="danger" class="ms-1" @click="del(row.item)">Delete</b-button>
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>

    <LocationForm ref="form" @save="saveLocation" />
    <ConfirmModal ref="confirm" message="Delete this location?" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import LocationForm from '../components/LocationForm.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

export default {
  components: { LocationForm, ConfirmModal },
  setup() {
    const locations = ref([]);
    const filter = ref('');
    const form = ref(null);
    const confirm = ref(null);
    const fields = ['name', 'query', { key: 'actions', label: 'Actions' }];

    async function load() {
      const res = await api.get('/api/locations');
      locations.value = res.data || [];
    }
    onMounted(load);

    const filtered = computed(() => {
      if (!filter.value) return locations.value;
      return locations.value.filter(l => l.name.toLowerCase().includes(filter.value.toLowerCase()) || l.query.toLowerCase().includes(filter.value.toLowerCase()));
    });

    function openAdd() { form.value.open(); }
    function edit(item) { form.value.open(item); }
    async function saveLocation(payload) {
      if (payload.id) await api.put(`/api/locations/${payload.id}`, payload);
      else await api.post('/api/locations', payload);
      await load();
    }
    async function del(item) {
      const ok = await confirm.value.open();
      if (!ok) return;
      await api.del(`/api/locations/${item.id}`);
      await load();
    }
    function use(item) {
      window.location.href = '/';
    }

    return { locations, filter, filtered, fields, form, confirm, openAdd, edit, saveLocation, del, use };
  }
};
</script>

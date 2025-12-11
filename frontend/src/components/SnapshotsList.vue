<template>
  <section class="snapshots">
    <h3>Snapshots</h3>
    <div v-if="loading">Loading snapshots…</div>
    <div v-else-if="error" class="error">Failed to load snapshots.</div>
    <div v-else-if="snapshots.length === 0">No snapshots yet.</div>
    <ul v-else>
      <li v-for="s in snapshots" :key="s.id">
        <strong>{{ s.name }}</strong> — {{ s.query }} — {{ s.createdAt }}
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useSnapshotsStore } from '../stores/snapshots';

const store = useSnapshotsStore();
const snapshots = computed(() => store.list);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

onMounted(() => {
  console.log('SnapshotsList mounted');
  store.fetchSnapshots().catch(e => console.error('fetchSnapshots failed', e));
});
</script>

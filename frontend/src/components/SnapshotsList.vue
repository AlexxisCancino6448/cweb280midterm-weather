<template>
  <section>
    <h3>Snapshots</h3>

    <div v-if="loading">Loading snapshots…</div>

    <div v-else-if="snapshots.length === 0">
      No snapshots yet. Use the weather search to create one.
    </div>

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

onMounted(() => {
  store.fetchSnapshots().catch(err => {
    console.error('Failed to load snapshots', err);
  });
});
</script>

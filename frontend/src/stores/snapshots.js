import { defineStore } from 'pinia';
import api from '../services/api';

export const useSnapshotsStore = defineStore('snapshots', {
  state: () => ({ list: [], loading: false }),
  actions: {
    async fetchSnapshots() {
      this.loading = true;
      try {
        const res = await api.get('/api/weather/snapshots');
        this.list = res?.data || res || [];
      } finally {
        this.loading = false;
      }
    }
  }
});

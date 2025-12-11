import { defineStore } from 'pinia';
import api from '../services/api';

export const useSnapshotsStore = defineStore('snapshots', {
  state: () => ({ list: [], loading: false, error: null }),
  actions: {
    async fetchSnapshots() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/api/weather/snapshots?cb=${Date.now()}`);
        console.log('snapshots API raw response:', res);
        this.list = res?.data || res || [];
      } catch (err) {
        this.error = err;
        console.error('fetchSnapshots error', err);
      } finally {
        this.loading = false;
      }
    }
  }
});

import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    _initialized: false
  }),
  getters: {
    isAuthenticated: (s) => !!s.token
  },
  actions: {
    loadFromStorage() {
      try {
        const raw = localStorage.getItem('auth');
        if (raw) {
          const parsed = JSON.parse(raw);
          this.user = parsed.user;
          this.token = parsed.token;
        }
      } catch {}
      this._initialized = true;
    },
    saveToStorage() {
      localStorage.setItem('auth', JSON.stringify({ user: this.user, token: this.token }));
    },
    clearStorage() {
      localStorage.removeItem('auth');
      this.user = null;
      this.token = null;
    },
    async login(email, password) {
    const res = await api.post('/api/auth/login', { email, password });
    const token = res?.data?.token || res?.token || res?.accessToken;
    if (!token) throw new Error('No token returned from login');
    this.token = token;
    this.saveToStorage();
    const me = await api.get('/api/users/me');
    this.user = me?.data || me;
    this.saveToStorage();
    },
    async register(username, email, password) {
      await api.post('/api/auth/register', { username, email, password });
      await this.login(email, password);
    },
    logout() {
      this.clearStorage();
    }
  }
});

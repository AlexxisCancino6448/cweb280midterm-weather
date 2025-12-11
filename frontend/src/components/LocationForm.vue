<template>
  <b-modal v-model="show" :title="isEdit ? 'Edit Location' : 'Add Location'" @ok="submit">
    <b-form @submit.stop.prevent="submit">
      <b-form-group label="Name" label-for="name">
        <b-form-input id="name" v-model="form.name" required />
      </b-form-group>

      <b-form-group label="Query (city or place)" label-for="query">
        <b-form-input id="query" v-model="form.query" required />
      </b-form-group>

      <b-form-group label="Notes" label-for="notes">
        <b-form-textarea id="notes" v-model="form.notes" rows="3" />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { ref } from 'vue';
export default {
  emits: ['save'],
  setup(_, { emit, expose }) {
    const show = ref(false);
    const form = ref({ id: null, name: '', query: '', notes: '' });
    const isEdit = ref(false);

    function open(data = null) {
      if (data) {
        form.value = { ...data };
        isEdit.value = true;
      } else {
        form.value = { id: null, name: '', query: '', notes: '' };
        isEdit.value = false;
      }
      show.value = true;
    }

    function submit() {
      if (!form.value.name || !form.value.query) return;
      emit('save', { ...form.value });
      show.value = false;
    }

    expose({ open });
    return { show, form, open, submit, isEdit };
  }
};
</script>

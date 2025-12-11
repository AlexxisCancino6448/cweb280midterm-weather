<template>
  <b-card class="mb-2">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <h5>{{ location.name }}</h5>
        <p class="mb-0 text-muted">{{ location.query }}</p>
        <small class="text-muted">Added: {{ formattedDate }}</small>
      </div>
      <div>
        <b-button size="sm" variant="primary" @click="$emit('use', location)">Use</b-button>
        <b-button size="sm" variant="warning" class="ms-1" @click="$emit('edit', location)">Edit</b-button>
        <b-button size="sm" variant="danger" class="ms-1" @click="$emit('delete', location)">Delete</b-button>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  props: { location: { type: Object, required: true } },
  computed: {
    formattedDate() {
      return this.location.created_at ? new Date(this.location.created_at).toLocaleString() : '—';
    }
  }
};
</script>

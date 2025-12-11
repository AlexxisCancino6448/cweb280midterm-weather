<template>
  <div aria-live="polite" aria-atomic="true" class="position-fixed bottom-0 end-0 p-3" style="z-index: 2000;">
    <b-toast v-for="(t, i) in toasts" :key="i" :title="t.title" :variant="t.variant" :auto-hide-delay="t.delay || 3000" solid>
      {{ t.message }}
    </b-toast>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup(_, { expose }) {
    const toasts = ref([]);
    function push(t) {
      toasts.value.push(t);
      setTimeout(() => toasts.value.shift(), t.delay || 3000);
    }
    expose({ push });
    return { toasts };
  }
};
</script>

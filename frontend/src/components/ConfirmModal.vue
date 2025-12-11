<template>
  <b-modal v-model="show" title="Confirm" @ok="confirm">
    <p>{{ message }}</p>
  </b-modal>
</template>

<script>
import { ref } from 'vue';
export default {
  props: { message: { type: String, default: 'Are you sure?' } },
  setup(props, { expose }) {
    const show = ref(false);
    let resolveFn;
    function open() {
      show.value = true;
      return new Promise((resolve) => { resolveFn = resolve; });
    }
    function confirm() {
      show.value = false;
      resolveFn(true);
    }
    expose({ open });
    return { show, message: props.message, confirm };
  }
};
</script>

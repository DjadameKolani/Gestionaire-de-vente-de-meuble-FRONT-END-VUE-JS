<template>
  <span :class="'badge badge-' + status">{{ status }}</span>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
    },
  },
}
</script>

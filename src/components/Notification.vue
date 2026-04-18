<template>
  <transition name="slide">
    <div v-if="visible" class="notif">✓ {{ message }}</div>
  </transition>
</template>

<script>
export default {
  props: { message: String, visible: Boolean },
}
</script>

<style scoped>
.notif {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: #eaf3de;
  color: #27500a;
  border: 1px solid #c0dd97;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>

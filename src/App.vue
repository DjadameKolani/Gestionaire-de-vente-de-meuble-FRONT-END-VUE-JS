<template>
  <div id="app">
    <Notification :message="notifMessage" :visible="notifVisible" />
    <router-view @notify="showNotif" />
  </div>
</template>

<script>
import Notification from './components/Notification.vue'

export default {
  name: 'App',
  components: { Notification },
  data() {
    return {
      notifMessage: '',
      notifVisible: false,
      notifTimer: null,
    }
  },
  methods: {
    showNotif(message) {
      this.notifMessage = message
      this.notifVisible = true
      clearTimeout(this.notifTimer)
      this.notifTimer = setTimeout(() => {
        this.notifVisible = false
      }, 3000)
    },
  },
}
</script>
<style>
*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: transparent; /* ← ne plus forcer une couleur ici */
}

#app {
  min-height: 100vh;
}
</style>

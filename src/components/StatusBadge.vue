<template>
  <span class="badge" :class="cls">{{ statut }}</span>
</template>

<script>
export default {
  props: { statut: String },
  computed: {
    cls() {
      return { Actif: 'green', Inactif: 'red', 'En attente': 'amber' }[this.statut] || 'gray'
    },
  },
}
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}
.green {
  background: #eaf3de;
  color: #27500a;
}
.red {
  background: #fcebeb;
  color: #791f1f;
}
.amber {
  background: #faeeda;
  color: #633806;
}
.gray {
  background: #f1efe8;
  color: #444441;
}
</style>

<script setup lang="ts">
import Header from '../components/Header.vue'
import Body from '@/components/Body.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')

  if (token && role === 'ROLE_ADMIN') {
    router.push('/admin')
  } else if (token && role === 'ROLE_USER') {
    router.push('/User')
  }
}) // ← accolade et parenthèse fermantes manquantes
</script>

<template>
  <main>
    <Header />
    <Body />
    <Footer />
  </main>
</template>

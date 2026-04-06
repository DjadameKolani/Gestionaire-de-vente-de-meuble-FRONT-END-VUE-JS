<script setup lang="ts">
import AdminSidebar from '../components/Admin/AdminSidebar.vue'
import AdminTopbar from '../components/Admin/AdminTopbar.vue'
</script>
<template>
  <div class="sb-admin-wrapper">
    <div id="wrapper">
      <AdminSidebar />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <AdminTopbar />
          <div class="container-fluid">
            <RouterView />
          </div>
        </div>
        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>Copyright &copy; {{ new Date().getFullYear() }}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

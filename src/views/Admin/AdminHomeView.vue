<script setup>
import AdminSidebar from '@/components/Admin/AdminSidebar.vue';

import AdminTopbar from '@/components/admin/AdminTopbar.vue';
<template>

<div id="wrapper">
    <AdminSidebar />
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <AdminTopbar />
        <div class="container-fluid">
          <!-- Les pages admin s'affichent ici -->
          <RouterView />
        </div>
      </div>
      <footer class="sticky-footer bg-white">
        <div class="container my-auto">
          <div class="copyright text-center my-auto">
            <span>Copyright &copy; Furni Admin {{ new Date().getFullYear() }}</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
</template>

  </template>
</script>

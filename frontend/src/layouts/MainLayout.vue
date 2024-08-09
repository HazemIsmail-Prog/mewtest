<template>
  <div class="flex h-dvh">
    <Sidebar />
    <div class="flex flex-col flex-1">
      <Topbar />
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Topbar from "@/components/Topbar.vue";
</script>

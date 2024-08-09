<template>
  <div
    class=" transition-all duration-150 overflow-hidden bg-primary bg-opacity-10 text-primary"
    :class="{
      'w-0': !sidebarStore.show,
      'w-[250px]': sidebarStore.show
      }"
  >
    <div class="p-3 text-center">{{ authStore.authUser?.name }}</div>
    <div class="p-3 flex flex-col gap-1">
      <SidebarItem route="/users" :title="$t('Users')" />
      <SidebarItem route="/contracts" :title="$t('Contracts')" />
      <SidebarItem route="/stakeholders" :title="$t('Stakeholders')" />
      <SidebarItem route="/documents" :title="$t('Documents')" />
    </div>
  </div>
</template>

<script setup>
import { useSidebarStore } from "@/stores/sidebar";
import SidebarItem from "./SidebarItem.vue";
import { useAuthStore } from "@/stores/auth";

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
</script>

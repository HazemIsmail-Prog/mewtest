<template>
  <div
    class="flex items-center justify-between p-3 gap-3 bg-primary bg-opacity-10"
  >
    <MenuIcon
      class="select-none cursor-pointer text-primary"
      @click="sidebarStore.show = !sidebarStore.show"
    />
    <div class="flex items-center gap-2">
      <!-- <div class="locale-changer">
        <select v-model="localeStore.locale">
          <option
            v-for="locale in $i18n.availableLocales"
            :key="`locale-${locale}`"
            :value="locale"
          >
            {{ locale }}
          </option>
        </select>
      </div> -->
      <LogoutIcon
        class="select-none cursor-pointer text-primary"
        @click="authStore.logout"
      />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useSidebarStore } from "@/stores/sidebar";
import { useLocaleStore } from "@/stores/locale";
import MenuIcon from "vue-material-design-icons/Menu.vue";
import LogoutIcon from "vue-material-design-icons/Logout.vue";

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const localeStore = useLocaleStore();
</script>

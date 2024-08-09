<template>
  <div
    class="flex items-center gap-5 justify-between border-t border-primary text-primary text-sm pt-3 h-12"
  >
    <div
      v-if="meta.links?.length > 3"
      class="flex items-center justify-center gap-0.5"
    >
      <button
        @click="meta.current_page = Number(meta.current_page) - 1"
        :disabled="meta.current_page === 1"
        class="w-10 flex items-center justify-center rounded-full border border-primary hover:bg-primary hover:text-white hover:opacity-50"
        :class="{ ' cursor-not-allowed': meta.current_page === 1 }"
      >
        <ChevronLeft
          :size="20"
          :class="{
            'rotate-180': localeStore.dir == 'rtl',
          }"
        />
      </button>
      <div
        class="hidden lg:block"
        v-for="(link, index) in meta.links"
        :key="link.label"
      >
        <button
          v-if="index !== 0 && index !== meta.links.length - 1"
          @click="meta.current_page = Number(link.label)"
          class="mx-0.5 w-10 rounded-full border border-primary hover:bg-primary hover:text-white hover:opacity-50"
          :class="{
            'bg-primary text-white font-extrabold': link.active,
          }"
          v-html="link.label"
        ></button>
      </div>
      <button
        @click="meta.current_page = Number(meta.current_page) + 1"
        :disabled="meta.current_page === meta.last_page"
        class="w-10 flex items-center justify-center rounded-full border border-primary hover:bg-primary hover:text-white hover:opacity-50"
        :class="{
          ' cursor-not-allowed': meta.current_page === meta.last_page,
        }"
      >
        <ChevronRight
          :size="20"
          :class="{
            'rotate-180': localeStore.dir == 'rtl',
          }"
        />
      </button>
    </div>
    <div v-else></div>

    <div class="flex items-center gap-1 text-sm text-primary">
      <p class="me-3">{{ $t("Per Page") }}</p>
      <button
        v-for="number in [5, 10, 50, 100]"
        :key="number"
        @click="meta.per_page = number"
        type="button"
        class="w-10 rounded-full font-medium border border-primary hover:bg-primary hover:text-white hover:opacity-50"
        :class="{
          'text-white bg-primary': meta.per_page === number,
          'bg-transparent': meta.per_page != number,
        }"
      >
        {{ number }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useLocaleStore } from "@/stores/locale";
import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue";
import ChevronRight from "vue-material-design-icons/ChevronRight.vue";

const localeStore = useLocaleStore()

defineProps({
  meta: {
    type: Object,
    required: true,
  },
});
</script>

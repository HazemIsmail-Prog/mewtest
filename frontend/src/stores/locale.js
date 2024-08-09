import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

export const useLocaleStore = defineStore("locale", () => {
  const locale = ref("AR");
  const title = ref(null);

  const dir = computed(() => (locale.value === "AR" ? "rtl" : "ltr"));

  watch(
    locale,
    (newLocale) => {
      document.dir = dir.value;
    },
    { immediate: true }
  );

  return { locale, dir, title };
});

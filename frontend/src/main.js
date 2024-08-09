import "./assets/main.css";

import { useLocaleStore } from "./stores/locale";
import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import EN from "@/locale/en.json";
import AR from "@/locale/ar.json";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(router);
const localeStore = useLocaleStore();
const i18n = createI18n({
  locale: localeStore.locale,
  fallbackLocale: "EN",
  messages: {
    EN: EN,
    AR: AR,
  },
});

app.use(i18n);

app.mount("#app");


localeStore.$subscribe((_, state) => {
  i18n.global.locale = state.locale;
  document.title = i18n.global.t(state.title);
});

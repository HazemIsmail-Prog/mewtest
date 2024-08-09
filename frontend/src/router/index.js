import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { useAuthStore } from "@/stores/auth";
import { useLocaleStore } from "@/stores/locale";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "documents", // Redirect root path to /documents
    },
    {
      path: "/login",
      component: AuthLayout,
      children: [
        {
          path: "/",
          name: "login",
          component: () => import("../components/LoginView.vue"),
          meta: { guest: true, title: "Login" },
        },
      ],
    },
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "users",
          name: "users",
          component: () => import("../views/users/ListView.vue"),
          meta: {
            auth: true,
            title: "Users",
          },
        },
        {
          path: "contracts",
          name: "contracts",
          component: () => import("../views/contracts/ListView.vue"),
          meta: { auth: true, title: "Contracts" },
        },
        {
          path: "stakeholders",
          name: "stakeholders",
          component: () => import("../views/stakeholders/ListView.vue"),
          meta: { auth: true, title: "Stakeholders" },
        },
        {
          path: "documents",
          name: "documents",
          component: () => import("../views/documents/ListView.vue"),
          meta: { auth: true, title: "Documents" },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const localeStore = useLocaleStore();
  await authStore.getUser();

  localeStore.title = to.meta.title;

  if (authStore.authUser && to.meta.guest) {
    return next({ name: "documents" });
  }
  if (!authStore.authUser && to.meta.auth) {
    return next({ name: "login" });
  }

  next();
});

export default router;

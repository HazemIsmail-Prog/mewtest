<template>
  <div class=" max-w-2xl mx-auto p-2 h-dvh flex flex-col gap-8 justify-center items-center">
    <h1 class="text-3xl font-extrabold text-primary">Login to your account</h1>

    <form @submit.prevent="handleLogin" class=" w-full space-y-6">
      <InputTextWithLabel
        :label="$t('Username')"
        id="username"
        type="username"
        v-model="formData.username"
        :error="
          authStore.authErrors?.username ? authStore.authErrors.username[0] : null
        "
      />
      <InputTextWithLabel
        :label="$t('Password')"
        id="password"
        type="password"
        v-model="formData.password"
        :error="
          authStore.authErrors?.password
            ? authStore.authErrors.password[0]
            : null
        "
      />

      <PrimaryButton :disabled="isLoading" type="submit">
        {{ $t("Login") }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import InputTextWithLabel from "./InputTextWithLabel.vue";
import PrimaryButton from "./PrimaryButton.vue";

const authStore = useAuthStore();

const isLoading = ref(false);

const formData = reactive({
  username: "hazem",
  password: "123123123",
});

function handleLogin() {
  isLoading.value = true;
  authStore.authenticate("login", formData);
  isLoading.value = false;
}
</script>

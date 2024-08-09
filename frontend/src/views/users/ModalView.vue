<template>
  <div
  class="transition-all overflow-hidden"
      :class="{
        'w-1/4': store.showModal,
        'w-0': !store.showModal,
      }"
  >
  <form
    @submit.prevent="store.handleSubmit()"
    class="flex flex-col gap-3 h-full transition-all duration-1000 p-3 bg-primary bg-opacity-10"
  >
    <div class="flex justify-between items-center border-b border-primary pb-3">
      <h2 class="text-xl font-bold text-primary">
        {{ $t(store.modalTitle) }}
      </h2>
    </div>
    <div class="flex-1 overflow-y-auto">
      <InputTextWithLabel
        :label="$t('Name')"
        id="name"
        type="text"
        v-model="store.form.name"
        :error="store.errors?.name ? store.errors.name[0] : null"
      />
      <InputTextWithLabel
        :label="$t('Username')"
        id="username"
        type="text"
        v-model="store.form.username"
        :error="store.errors?.username ? store.errors.username[0] : null"
      />
      <InputTextWithLabel
        :label="$t('Password')"
        id="password"
        type="password"
        v-model="store.form.password"
        :error="store.errors?.password ? store.errors.password[0] : null"
      />
    </div>
    <div class="flex justify-end border-t h-12 border-primary pt-3">
      <PlainButton @click="store.closeModal()">
        {{ $t("Cancel") }}
      </PlainButton>
      <PrimaryButton
        :disabled="store.isCreating || store.isUpdating"
        type="submit"
      >
        {{
          store.isCreating
            ? "Creating..."
            : store.isUpdating
            ? "Updating..."
            : $t("Save")
        }}
      </PrimaryButton>
    </div>
  </form>
  </div>
</template>

<script setup>
import InputTextWithLabel from "@/components/InputTextWithLabel.vue";
import { useUserStore } from "./store";
import PlainButton from "@/components/PlainButton.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

const store = useUserStore();
</script>

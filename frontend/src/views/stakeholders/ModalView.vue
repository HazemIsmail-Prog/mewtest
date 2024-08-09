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
      v-if="store.showModal"
      class="flex flex-col gap-3 h-full transition-all duration-1000 p-3 bg-primary bg-opacity-10"
    >
      <div
        class="flex justify-between items-center border-b border-primary pb-3"
      >
        <h2 class="text-xl font-bold text-primary">
          {{ $t(store.modalTitle) }}
        </h2>
      </div>
      <div class="flex-1 overflow-y-auto">
        <TextAreaWithLabel
          :label="$t('Name')"
          :required="true"
          id="name"
          type="text"
          v-model="store.form.name"
          :error="store.errors?.name ? store.errors.name[0] : null"
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
              ? $t("Creating...")
              : store.isUpdating
              ? $t("Updating...")
              : $t("Save")
          }}
        </PrimaryButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import PlainButton from "@/components/PlainButton.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import TextAreaWithLabel from "@/components/TextAreaWithLabel.vue";
import { useStakeholderStore } from "./store";

const store = useStakeholderStore();
</script>

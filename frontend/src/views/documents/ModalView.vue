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
          {{ $t(store.modalTitle) }} - {{ $t(store.form.type) }}
        </h2>
      </div>

      <div class="flex-1 overflow-y-auto no-scrollbar">
        <StepsComponent
          v-if="store.selectedRecord"
          :key="store.selectedRecord.id"
          :selectedRecordId="store.selectedRecord.id"
        />

        <SingleSearchableSelectWithLabel
          :label="$t('Contract')"
          :list="store.allContractsList"
          id="contract_id"
          v-model="store.form.contract_id"
          :error="
            store.errors?.contract_id ? store.errors.contract_id[0] : null
          "
        />
        <SingleSearchableSelectWithLabel
          :label="$t('From')"
          :list="store.allStakeholdersList"
          id="from_id"
          v-model="store.form.from_id"
          :error="store.errors?.from_id ? store.errors.from_id[0] : null"
        />
        <SingleSearchableSelectWithLabel
          :label="$t('To')"
          :list="store.allStakeholdersList"
          id="to_id"
          v-model="store.form.to_id"
          :error="store.errors?.to_id ? store.errors.to_id[0] : null"
        />
        <TextAreaWithLabel
          :label="$t('Title')"
          :required="true"
          id="title"
          type="text"
          v-model="store.form.title"
          :error="store.errors?.title ? store.errors.title[0] : null"
        />
        <TextAreaWithLabel
          :label="$t('Content')"
          :required="false"
          id="content"
          type="text"
          v-model="store.form.content"
          :error="store.errors?.content ? store.errors.content[0] : null"
        />
        <TextAreaWithLabel
          :label="$t('Notes')"
          :required="false"
          id="notes"
          type="text"
          v-model="store.form.notes"
          :error="store.errors?.notes ? store.errors.notes[0] : null"
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
import { useDocumentStore } from "./store";
import SingleSearchableSelectWithLabel from "@/components/SingleSearchableSelectWithLabel.vue";
import StepsComponent from "./steps/StepsComponent.vue";

const store = useDocumentStore();
</script>

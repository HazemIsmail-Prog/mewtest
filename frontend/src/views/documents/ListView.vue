<template>
  <div class="flex h-full">
    <div class="flex-1 flex flex-col p-3">
      <!-- Header -->
      <div class="flex items-center justify-between py-3">
        <div class="flex items-end gap-3">
          <h1 class="text-3xl font-extrabold text-primary">
            {{ $t(store.modelPluralName) }}
          </h1>
          <div
            class="bg-primary text-center text-white text-sm font-bold px-3 mb-[5px] rounded-full"
          >
            {{ store.meta.total }}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <PrimaryButton
            class="!bg-success"
            @click="store.openModal(null, 'incoming')"
          >
            <TrayArrowDownIcon :size="20" />
            <span>{{ $t("incoming") }}</span>
          </PrimaryButton>
          <PrimaryButton
            class=" !bg-danger"
            @click="store.openModal(null, 'outgoing')"
          >
            <TrayArrowUpIcon :size="20" />
            <span>{{ $t("outgoing") }}</span>
          </PrimaryButton>
        </div>
      </div>
      <!-- Search Input -->
      <div class="py-3 flex items-center gap-2">
        <InputTextWithLabel
          :label="$t('Search...')"
          id="search"
          type="search"
          v-model="store.filters.search"
        />
        <MultipuleSearchableSelectWithLabel
          :label="$t('Contract')"
          :list="store.allContractsList"
          id="contract_id"
          v-model="store.filters.contract_id"
        />
        <MultipuleSearchableSelectWithLabel
          :label="$t('From')"
          :list="store.allStakeholdersList"
          id="from_id"
          v-model="store.filters.from_id"
        />
        <MultipuleSearchableSelectWithLabel
          :label="$t('To')"
          :list="store.allStakeholdersList"
          id="to_id"
          v-model="store.filters.to_id"
        />
      </div>
      <!-- Content -->
      <div class="flex-1 overflow-y-auto no-scrollbar">
        <ItemView
          v-for="record in store.results"
          :key="record.id"
          :record="record"
        />
      </div>
      <!-- Pagination -->
      <Pagination :meta="store.meta" />
    </div>

    <!-- Modal -->
    <ModalView />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ItemView from "./ItemView.vue";
import ModalView from "./ModalView.vue";
import Pagination from "@/components/Pagination.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useDocumentStore } from "./store";
import InputTextWithLabel from "@/components/InputTextWithLabel.vue";
import TrayArrowDownIcon from "vue-material-design-icons/TrayArrowDown.vue";
import TrayArrowUpIcon from "vue-material-design-icons/TrayArrowUp.vue";
import MultipuleSearchableSelectWithLabel from "@/components/MultipuleSearchableSelectWithLabel.vue";


const store = useDocumentStore();

// Fetch users on component mount
onMounted(() => {
  store.fetchResults();
  store.getContractList();
  store.getStakeholderList();
});
</script>

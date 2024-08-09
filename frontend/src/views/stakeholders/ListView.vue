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
        <PrimaryButton @click="store.openModal(null)">
          <PlusIcon :size="18" />
          <span>{{ $t("New") }}</span>
        </PrimaryButton>
      </div>
      <!-- Search Input -->
      <div class="py-3">
        <input
          v-model="store.filters.search"
          type="text"
          :placeholder="$t('Search...')"
          class="border border-primary py-2 px-4 rounded w-full placeholder:opacity-60 placeholder:text-primary"
        />
      </div>
      <!-- Content -->
      <div class="flex-1 overflow-y-auto no-scrollbar">
        <div
          v-if="store.isFetching"
          class="flex items-center justify-center p-5 my-2 rounded-xl bg-zinc-100 transition-all duration-300"
        >
          <div class="text-lg font-semibold">{{ $t("Loading...") }}</div>
        </div>
        <ItemView
          v-else
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
import PlusIcon from "vue-material-design-icons/Plus.vue";
import Pagination from "@/components/Pagination.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useStakeholderStore } from "./store";

const store = useStakeholderStore();

// Fetch users on component mount
onMounted(() => {
  store.fetchResults();
});
</script>

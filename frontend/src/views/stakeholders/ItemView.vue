<template>
  <div
    @click="store.openModal(record)"
    class="group cursor-pointer select-none hover:bg-primary hover:bg-opacity-25 flex items-center justify-between gap-5 p-5 my-2 rounded-xl bg-zinc-100 transition-all duration-300"
    :class="{
      '!bg-primary text-white hover:opacity-100':
        store.selectedRecord?.id == record.id,
    }"
  >
    <div>
      <div class="text-lg font-semibold">{{ record.name }}</div>
      <div
        v-if="record.parentContract?.name"
        class="text-sm"
        :class="{ 'text-gray-100': store.selectedRecord?.id == record.id }"
      >
        {{ record.parentContract.name }}
      </div>
    </div>
    <button
      class="shadow-neumorphic group-hover:shadow-none transition-all duration-300 p-2 flex items-center justify-center border-none rounded-xl bg-zinc-100 cursor-pointer text-primary"
      :class="{ '!shadow-none': store.selectedRecord?.id == record.id }"
      @click.stop
      @click="confirmDelete(record)"
      title="Delete Record"
    >
      <DeleteIcon class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup>
import DeleteIcon from "vue-material-design-icons/Delete.vue";
import { useStakeholderStore } from "./store";

const store = useStakeholderStore();

const props = defineProps({
  record: Object,
});

const confirmDelete = (record) => {
  if (confirm(`Are you sure you want to delete ${record.name}?`)) {
    store.deleteRecord(record);
  }
};
</script>

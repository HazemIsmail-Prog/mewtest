<template>
  <div class="flex items-center gap-3">
    <label class="inline-flex items-center cursor-pointer">
      <input
        v-model="record.is_completed"
        type="checkbox"
        @change="store.updateCompletion(record.id)"
        class="hidden peer"
      />
      <div
        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
      ></div>
    </label>
    <div
      @click="store.openModal(record)"
      class="group flex-grow cursor-pointer select-none hover:bg-primary hover:bg-opacity-25 flex items-center justify-between gap-5 px-5 py-2 my-1 rounded-xl bg-zinc-100 transition-all duration-300"
      :class="{
        '!bg-primary text-white hover:opacity-100':
          store.selectedRecord?.id == record.id,
      }"
    >
      <div>
        <div class="font-semibold whitespace-pre-wrap">{{ record.title }}</div>
        <div class="flex items-center gap-3">
          <TrayArrowDownIcon
            v-if="record.type == 'incoming'"
            :size="22"
            class="text-success"
            :class="{'text-white':store.selectedRecord?.id == record.id}"

          />
          <TrayArrowUpIcon
            v-if="record.type == 'outgoing'"
            :size="22"
            class="text-danger"
            :class="{'text-white':store.selectedRecord?.id == record.id}"
          />
          <div class="text-sm">
            <div>{{ record.contract?.name }}</div>
            <div v-if="record.type == 'incoming'">{{ record.sender?.name }}</div>
            <div v-if="record.type == 'outgoing'">
              {{ record.receiver?.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-1/4 justify-between items-center gap-3">
        <div 
        class=" whitespace-pre-line text-sm"
        :class="{
          'text-danger' : !record.lastStep?.is_completed,
          'text-success' : record.lastStep?.is_completed,
          'text-white' : store.selectedRecord?.id == record.id,
        }"
        >{{ record.lastStep?.action }}</div>
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
    </div>
  </div>
</template>

<script setup>
import DeleteIcon from "vue-material-design-icons/Delete.vue";
import TrayArrowDownIcon from "vue-material-design-icons/TrayArrowDown.vue";
import TrayArrowUpIcon from "vue-material-design-icons/TrayArrowUp.vue";
import { useDocumentStore } from "./store";

const store = useDocumentStore();

const props = defineProps({
  record: Object,
});

const confirmDelete = (record) => {
  if (confirm(`Are you sure you want to delete ${record.name}?`)) {
    store.deleteRecord(record);
  }
};
</script>
